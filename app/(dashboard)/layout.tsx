export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="mesh-bg" />
      <Sidebar />
      <TopBar user={{ name: user.user_metadata?.full_name ?? user.email, email: user.email, image: user.user_metadata?.avatar_url }} />
      <main className="ml-64 pt-16 min-h-screen relative z-10">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
