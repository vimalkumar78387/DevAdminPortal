import { cn } from "@/lib/utils";
import React from "react";

const variants = {
  primary:
    "bg-gradient-to-r from-indigo-600 to-emerald-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-emerald-500/30",
  outline:
    "border border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300",
  ghost: "text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-500 shadow shadow-red-200",
} as const;

type Variant = keyof typeof variants;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
