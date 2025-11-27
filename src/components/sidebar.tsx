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
  { href: "/admin/changelog", label: "Changelog Post", icon: BadgeCheck },
  // Placeholder for answers tab if needed later
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-white/10 bg-gradient-to-b from-blue-900 via-blue-800 to-slate-950 px-4 py-6 text-white shadow-xl shadow-slate-900/40 backdrop-blur">
      <div className="flex items-center gap-3 px-1">
        <img
          src="https://sabpaisa.in/wp-content/uploads/2023/06/logo.png"
          alt="SabPaisa logo"
          className="h-7 w-auto drop-shadow"
          loading="lazy"
        />
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
                  ? "bg-blue-500/25 text-white ring-1 ring-blue-400/60 shadow-lg shadow-blue-900/40"
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
