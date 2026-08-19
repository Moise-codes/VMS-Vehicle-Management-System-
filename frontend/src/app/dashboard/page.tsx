"use client";

import { useEffect, useState } from "react";
import {
  CarFront,
  Link2,
  Users,
  AlertCircle,
  ArrowRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface DashboardStats {
  totalClients: number;
  totalVehicles: number;
  totalAssignedVehicles: number;
  totalUnassignedVehicles: number;
}

export default function DashboardPage() {
  const { admin } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalVehicles: 0,
    totalAssignedVehicles: 0,
    totalUnassignedVehicles: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const response = await api.get("/dashboard");

        setStats(response.data.stats);
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      href: "/dashboard/clients",
      description: "Registered clients",
    },
    {
      title: "Total Vehicles",
      value: stats.totalVehicles,
      icon: CarFront,
      href: "/dashboard/vehicles",
      description: "Registered vehicles",
    },
    {
      title: "Assigned Vehicles",
      value: stats.totalAssignedVehicles,
      icon: Link2,
      href: "/dashboard/assignments",
      description: "Linked to clients",
    },
    {
      title: "Unassigned Vehicles",
      value: stats.totalUnassignedVehicles,
      icon: AlertCircle,
      href: "/dashboard/vehicles",
      description: "Awaiting assignment",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-500">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {admin?.names?.split(" ")[0] || "Administrator"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's what's happening in your vehicle management workspace.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
          <Activity size={17} />
          System operational
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              href={card.href}
              key={card.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Icon size={20} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-900"
                />
              </div>

              <p className="mt-6 text-sm font-medium text-slate-500">
                {card.title}
              </p>

              <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {loading ? "—" : card.value.toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {card.description}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Vehicle assignment overview
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Current allocation of vehicles in your workspace.
            </p>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-slate-500">Assigned vehicles</span>

              <span className="font-semibold text-slate-900">
                {loading
                  ? "—"
                  : stats.totalVehicles > 0
                    ? Math.round(
                        (stats.totalAssignedVehicles /
                          stats.totalVehicles) *
                          100
                      )
                    : 0}
                %
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900 transition-all duration-700"
                style={{
                  width:
                    stats.totalVehicles > 0
                      ? `${Math.min(
                          (stats.totalAssignedVehicles /
                            stats.totalVehicles) *
                            100,
                          100
                        )}%`
                      : "0%",
                }}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Assigned</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {loading ? "—" : stats.totalAssignedVehicles}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Unassigned</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {loading ? "—" : stats.totalUnassignedVehicles}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <CarFront size={21} />
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            Manage your vehicles
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Register vehicles, review their details and link them to
            registered clients.
          </p>

          <Link
            href="/dashboard/vehicles"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white"
          >
            Open vehicle management
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}