export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isAdmin: false });
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    // Primary check: email match against ADMIN_EMAIL env var
    if (adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase()) {
      // Ensure admin user exists in DB (password login bypasses /auth/callback)
      await prisma.user.upsert({
        where: { id: user.id },
        update: { email: user.email ?? "", isAdmin: true },
        create: {
          id: user.id,
          email: user.email ?? "",
          name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? "Admin",
          isAdmin: true,
        },
      });
      return NextResponse.json({ isAdmin: true });
    }

    // Fallback: check DB flag
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    return NextResponse.json({ isAdmin: !!dbUser?.isAdmin });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
