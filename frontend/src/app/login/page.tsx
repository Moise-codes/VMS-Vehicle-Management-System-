"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Eye, EyeOff, Lock, Mail } from "lucide-react";

import { loginAdmin } from "../../lib/auth";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginAdmin({
        email,
        password,
      });

      setAdmin(response.admin);
      router.replace("/dashboard");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between border-r border-white/10 p-10">
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
              Manage your vehicle operations with confidence.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
              Securely manage clients, vehicles, plate assignments and
              operational records from one centralized platform.
            </p>
          </div>

          <div className="relative text-sm text-slate-600">
            Secure MAGERWA Management System
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
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

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                Welcome back
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Access your administrator workspace and manage your records.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-white/30 focus:bg-white/[0.06]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-600 focus:border-white/30 focus:bg-white/[0.06]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
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
                className="w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an administrator account?{" "}
              <Link
                href="/register"
                className="font-medium text-white hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}