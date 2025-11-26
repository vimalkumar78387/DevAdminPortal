"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  LogOut,
  Settings,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/community/posts", label: "Community Posts", icon: MessageSquare },
  // Placeholder for answers tab if needed later
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-white/10 bg-slate-950/80 px-4 py-6 text-white shadow-xl shadow-slate-900/30 backdrop-blur">
      <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
        <img
          src="https://settlepaisa.sabpaisa.in/img/logo/logo-dark-full.png"
          alt="SabPaisa logo"
          className="h-6 w-auto drop-shadow"
          loading="lazy"
        />
        <BadgeCheck className="h-6 w-6 text-emerald-400" />
      </div>
      <nav className="mt-8 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition hover:translate-x-1",
                active
                  ? "bg-emerald-500/20 text-white ring-1 ring-emerald-400/60 shadow-lg shadow-emerald-900/40"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-2">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
        >
          <Settings className="h-5 w-5" /> Settings
        </Link>
        <Link
          href="/logout"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" /> Logout
        </Link>
      </div>
    </aside>
  );
}
