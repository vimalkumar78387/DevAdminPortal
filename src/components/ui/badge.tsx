import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "muted";
  className?: string;
}) {
  const styles = {
    default: "bg-slate-100 text-slate-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-700",
    muted: "bg-slate-50 text-slate-500",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
