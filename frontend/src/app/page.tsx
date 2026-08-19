import Link from "next/link";
import {
  ArrowRight,
  CarFront,
  ShieldCheck,
  Users,
  BarChart3,
  CheckCircle2,
  Building2,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
              <Building2 size={20} />
            </div>

            <div>
              <p className="font-bold tracking-tight">MAGERWA</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Vehicle Management
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-300">
              <ShieldCheck size={15} />
              Secure Vehicle Management Platform
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Manage vehicles and clients with{" "}
              <span className="text-slate-400">
                complete control.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              A professional management platform for organizing vehicle
              records, clients, assignments and plate numbers in one secure
              workspace.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Create Administrator Account
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-px px-6 lg:grid-cols-3 lg:px-8">
          <Feature
            icon={<CarFront size={22} />}
            title="Vehicle Management"
            description="Maintain detailed records for every registered vehicle."
          />

          <Feature
            icon={<Users size={22} />}
            title="Client Management"
            description="Keep client information organized inside your workspace."
          />

          <Feature
            icon={<ShieldCheck size={22} />}
            title="Secure Workspaces"
            description="Administrators only access the data belonging to their account."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Built for operations
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              Everything important in one workspace.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-400">
              From registering clients and vehicles to assigning unique
              plate numbers, the system provides a structured workflow for
              daily vehicle operations.
            </p>

            <div className="mt-8 space-y-4">
              <Benefit text="Centralized client records" />
              <Benefit text="Detailed vehicle information" />
              <Benefit text="Unique vehicle plate assignments" />
              <Benefit text="Paginated records for efficient browsing" />
              <Benefit text="Protected administrator access" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">
                    Vehicle Overview
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    Operations
                  </p>
                </div>

                <BarChart3 className="text-slate-500" size={25} />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <StatCard
                  label="Clients"
                  value="128"
                  icon={<Users size={17} />}
                />

                <StatCard
                  label="Vehicles"
                  value="246"
                  icon={<CarFront size={17} />}
                />

                <StatCard
                  label="Assigned"
                  value="194"
                  icon={<CheckCircle2 size={17} />}
                />

                <StatCard
                  label="Available"
                  value="52"
                  icon={<ShieldCheck size={17} />}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-16 sm:flex-row sm:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-bold">
              Ready to manage your operations?
            </h2>

            <p className="mt-2 text-slate-500">
              Create your administrator workspace and get started.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-slate-200"
          >
            Get Started
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 MAGERWA Vehicle Management System</p>

          <p>Secure • Organized • Professional</p>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
        {icon}
      </div>

      <h3 className="mt-5 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <CheckCircle2 size={18} className="shrink-0 text-slate-500" />
      {text}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-xs">{label}</span>
        {icon}
      </div>

      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}