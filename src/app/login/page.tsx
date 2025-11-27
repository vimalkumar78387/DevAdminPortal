import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-screen items-stretch overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.2),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.25),transparent_35%)]" />
      <div className="relative grid h-screen w-full grid-cols-1 overflow-hidden md:grid-cols-5">
        <div className="col-span-3 flex min-h-full flex-col justify-between gap-10 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-12 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-2">
              <img
                src="https://sabpaisa.in/wp-content/uploads/2023/06/logo.png"
                alt="SabPaisa logo"
                className="h-8 w-auto drop-shadow"
                loading="lazy"
              />
              <h1 className="text-2xl font-semibold text-white/90">DevAdminPortal</h1>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-semibold leading-tight">Welcome back, moderator</h2>
            <p className="text-base text-white/80">
              Sign in to review community posts, triage answers, and keep the discussion healthy. Only authorized product owners should proceed.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs text-white/85">
              <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                <p className="font-semibold">Secure cookie auth</p>
                <p className="text-white/70">httpOnly session with signed tokens</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                <p className="font-semibold">Live PostgreSQL</p>
                <p className="text-white/70">Moderate data in real time</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                <p className="font-semibold">Drizzle ORM</p>
                <p className="text-white/70">Typed queries + migrations</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                <p className="font-semibold">Fast actions</p>
                <p className="text-white/70">Delete posts & answers instantly</p>
              </div>
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
        <div className="col-span-2 flex min-h-full flex-col bg-white/95 p-12 backdrop-blur">
          <div className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Admin Access
            </p>
            <h3 className="text-3xl font-bold text-slate-900">Login</h3>
            <p className="text-sm text-slate-600">
              Enter your admin username and password to continue.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-900/10">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
