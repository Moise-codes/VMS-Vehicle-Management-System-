"use client";

import { Bell, Menu, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface DashboardTopbarProps {
  setMobileOpen: (value: boolean) => void;
}

export default function DashboardTopbar({
  setMobileOpen,
}: DashboardTopbarProps) {
  const { admin } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Administrator Portal
          </p>
          <p className="hidden text-xs text-slate-500 sm:block">
            MAGERWA Vehicle Management System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-slate-900" />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {admin?.names || "Administrator"}
            </p>

            <p className="max-w-[180px] truncate text-xs text-slate-500">
              {admin?.email || ""}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <UserCircle size={22} />
          </div>
        </div>
      </div>
    </header>
  );
}