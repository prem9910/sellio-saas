export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Upsert user in our DB
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {
          email: data.user.email ?? "",
          name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
          image: data.user.user_metadata?.avatar_url ?? null,
        },
        create: {
          id: data.user.id,
          email: data.user.email ?? "",
          name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
          image: data.user.user_metadata?.avatar_url ?? null,
        },
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
