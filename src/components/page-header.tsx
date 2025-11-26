import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin</p>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_6px] shadow-emerald-500/20 animate-pulse" />
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}
