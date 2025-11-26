import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 opacity-80" />
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="relative grid w-full max-w-5xl grid-cols-1 gap-8 rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl ring-1 ring-white/20 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-10">
          <div className="flex items-center gap-4 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 shadow-lg shadow-slate-900/20">
                <img
                  src="https://settlepaisa.sabpaisa.in/img/logo/logo-dark-full.png"
                  alt="SabPaisa logo"
                  className="h-7 w-auto"
                  loading="lazy"
                />
              </div>
              <h1 className="text-xl font-semibold text-white/90">DevAdminPortal</h1>
            </div>
          </div>
          <div className="space-y-4 text-white">
            <h2 className="text-3xl font-semibold leading-tight">Welcome back, moderator</h2>
            <p className="text-base text-white/70">
              Sign in to review community posts, triage answers, and keep the discussion healthy. Only authorized product owners should proceed.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-white/80">
              <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">Secure cookie auth</span>
              <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">Live PostgreSQL data</span>
              <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">Fast moderation tools</span>
            </div>
          </div>
          <p className="text-sm text-white/70">
            Need help? Contact the platform team or revisit the setup guide in{" "}
            <Link href="https://confluence" className="font-medium text-white underline">
              Confluence
            </Link>
            .
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/80 p-8 shadow-xl shadow-slate-900/20 backdrop-blur">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Admin Access
            </p>
            <h3 className="text-2xl font-bold text-slate-900">Login</h3>
            <p className="text-sm text-slate-600">
              Enter your admin username and password to continue.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
