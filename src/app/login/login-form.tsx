"use client";

import { loginAction } from "./actions";
import { ArrowRight } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const initialState = { error: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Signing in..." : "Sign in"}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-800" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          required
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-2 ring-transparent transition focus:border-slate-300 focus:ring-slate-200"
          placeholder="vimal"
          autoComplete="username"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-800" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-2 ring-transparent transition focus:border-slate-300 focus:ring-slate-200"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>
      {state?.error ? (
        <p className="text-sm font-medium text-red-600">{state.error}</p>
      ) : (
        <p className="text-sm text-slate-500">
          Use the admin credentials provided in your environment variables.
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
