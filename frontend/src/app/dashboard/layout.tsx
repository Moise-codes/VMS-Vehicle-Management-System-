"use client";

import { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-100">
        <DashboardSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="lg:pl-72">
          <DashboardTopbar setMobileOpen={setMobileOpen} />

          <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}