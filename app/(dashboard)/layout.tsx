export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import SessionProvider from "@/components/providers/SessionProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <div className="mesh-bg" />
        <Sidebar />
        <TopBar />
        <main className="ml-64 pt-16 min-h-screen relative z-10">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
