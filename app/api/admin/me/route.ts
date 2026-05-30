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
    if (adminEmail && user.email === adminEmail) {
      return NextResponse.json({ isAdmin: true });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    return NextResponse.json({ isAdmin: !!dbUser?.isAdmin });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
