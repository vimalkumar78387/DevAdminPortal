import { Sidebar } from "@/components/sidebar";
import { requireAdminSession } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | DevAdminPortal",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <Sidebar />
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </div>
    </div>
  );
}
