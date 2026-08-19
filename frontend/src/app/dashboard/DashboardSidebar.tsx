"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CarFront,
  Link2,
  LogOut,
  Building2,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface DashboardSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    name: "Vehicles",
    href: "/dashboard/vehicles",
    icon: CarFront,
  },
  {
    name: "Assignments",
    href: "/dashboard/assignments",
    icon: Link2,
  },
];

export default function DashboardSidebar({
  mobileOpen,
  setMobileOpen,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
              <Building2 size={20} />
            </div>

            <div>
              <p className="font-bold tracking-tight text-white">MAGERWA</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Vehicle Management
              </p>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Main menu
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-white text-slate-950"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-white/[0.04] p-3">
            <p className="truncate text-sm font-medium text-white">
              {admin?.names || "Administrator"}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {admin?.email || ""}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={19} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}