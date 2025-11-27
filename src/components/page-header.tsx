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
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_6px] shadow-blue-500/20 animate-ping" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
            SabPaisa
          </span>
        </div>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}
