import { requireAdmin } from "@/lib/admin";
import Link from "next/link";
import { Shield, Users, CreditCard, FileText, LayoutDashboard, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: FileText },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-full w-60 flex flex-col glass-card border-r z-50"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}
            >
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
              >
                Sellio
              </p>
              <p className="text-xs" style={{ color: "#6366F1" }}>
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group"
              style={{ color: "var(--text-muted)" }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-all duration-200"
              style={{ color: "var(--text-muted)" }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 p-6 min-h-screen">{children}</main>
    </div>
  );
}
