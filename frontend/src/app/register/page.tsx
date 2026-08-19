"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  CreditCard,
} from "lucide-react";

import { registerAdmin } from "../../lib/auth";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { setAdmin } = useAuth();

  const [form, setForm] = useState({
    names: "",
    email: "",
    phone: "",
    nationalId: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await registerAdmin(form);

      setAdmin(response.admin);
      router.replace("/dashboard");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.18),transparent_35%)]" />

          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
                <Building2 size={21} />
              </div>

              <div>
                <p className="font-bold">MAGERWA</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Vehicle Management
                </p>
              </div>
            </Link>
          </div>

          <div className="relative max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Administrator Portal
            </p>

            <h1 className="mt-5 text-5xl font-bold leading-tight">
              Create your secure management workspace.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Each administrator receives an isolated workspace for managing
              their own clients, vehicles and assignments.
            </p>
          </div>

          <div className="relative text-sm text-slate-600">
            Secure MAGERWA Management System
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-lg">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>

            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
                  <Building2 size={21} />
                </div>

                <div>
                  <p className="font-bold">MAGERWA</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Vehicle Management
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Administrator registration
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Create your account
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              Register to access your private management workspace.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Full names
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    required
                    value={form.names}
                    onChange={(e) => handleChange("names", e.target.value)}
                    placeholder="Enter your full names"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-white/30"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Phone
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      required
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+250..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-white/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  National ID
                </label>

                <div className="relative">
                  <CreditCard
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    required
                    value={form.nationalId}
                    onChange={(e) =>
                      handleChange("nationalId", e.target.value)
                    }
                    placeholder="Enter national ID"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    required
                    minLength={8}
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm outline-none placeholder:text-slate-600 focus:border-white/30"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create administrator account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-white hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}