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
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/50">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
