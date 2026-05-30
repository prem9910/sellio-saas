export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmationEmail } from "@/lib/resend";
type Plan = "FREE" | "STARTER" | "GROWTH" | "PRO";

const PLAN_MAP: Record<string, Plan> = {
  [process.env.RAZORPAY_STARTER_PLAN_ID ?? ""]: "STARTER",
  [process.env.RAZORPAY_GROWTH_PLAN_ID ?? ""]: "GROWTH",
  [process.env.RAZORPAY_PRO_PLAN_ID ?? ""]: "PRO",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "subscription.activated") {
    const subscription = event.payload.subscription.entity;
    const planId = subscription.plan_id as string;
    const notes = subscription.notes as Record<string, string>;
    const userId = notes?.userId;
    const plan = PLAN_MAP[planId];

    if (userId && plan) {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { plan, razorpayCustomerId: subscription.customer_id },
      });

      await sendPaymentConfirmationEmail(
        user.email,
        plan,
        `₹${subscription.current_end ? "—" : "—"}`
      );
    }
  }

  if (event.event === "subscription.cancelled") {
    const subscription = event.payload.subscription.entity;
    const notes = subscription.notes as Record<string, string>;
    const userId = notes?.userId;

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { plan: "FREE" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
