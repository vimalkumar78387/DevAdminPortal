import { cn } from "@/lib/utils";
import React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/95 p-5 shadow-lg shadow-slate-900/10 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-2xl",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {description ? (
          <p className="text-xs text-slate-500">{description}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}
