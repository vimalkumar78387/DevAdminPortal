"use client";

import useSWR from "swr";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Calendar, Trash2, Eye, Sparkles } from "lucide-react";

export type ChangelogEntry = {
  id: string;
  version: string;
  releaseDate: string;
  releaseType: string;
  status: string;
  productName: string;
  added: string[];
  improved: string[];
  fixed: string[];
  security: string[];
  deprecated: string[];
  breaking: string[];
};

type ApiResponse = {
  changelog: ChangelogEntry[];
};

function statusBadge(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "latest") return <Badge variant="success">Latest</Badge>;
  if (normalized === "deprecated") return <Badge variant="danger">Deprecated</Badge>;
  return <Badge>Stable</Badge>;
}

function typeBadge(type: string) {
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return <Badge variant="muted">{label}</Badge>;
}

export function ChangelogList() {
  const { data, error, mutate, isValidating } = useSWR<ApiResponse>("/api/changelog");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const preview = (entry: ChangelogEntry) => {
    const pool = [entry.added, entry.improved, entry.fixed, entry.breaking].flat().filter(Boolean);
    return pool[0] ?? "No preview available";
  };

  const onDelete = async () => {
    if (!deleteId) return;
    const target = deleteId;
    setDeleteId(null);
    if (data) {
      mutate({ changelog: data.changelog.filter((c) => c.id !== target) }, false);
    }
    const res = await fetch(`/api/changelog/${target}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      toast.success("Changelog deleted");
      mutate();
    } else {
      toast.error("Failed to delete changelog");
      mutate();
    }
  };

  const sorted = useMemo(() => {
    return data?.changelog ?? [];
  }, [data]);

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-600">Failed to load changelog.</p> : null}
      {isValidating && !data ? <p className="text-sm text-slate-600">Loading changelog…</p> : null}
      {sorted.length === 0 && !isValidating ? (
        <p className="text-sm text-slate-600">No changelog entries yet.</p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {sorted.map((entry) => (
            <Card key={entry.id} className="bg-white">
              <CardHeader
                title={`Version ${entry.version}`}
                description={
                  <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                      <Calendar className="h-4 w-4" /> {formatDate(entry.releaseDate)}
                    </span>
                    <Badge variant="muted">{entry.productName || "General"}</Badge>
                    {typeBadge(entry.releaseType)}
                    {statusBadge(entry.status)}
                  </div>
                }
              actions={
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/changelog/${entry.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    <Eye className="h-4 w-4" /> View
                  </Link>
                  <Button variant="danger" onClick={() => setDeleteId(entry.id)}>
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              }
            />
            <div className="space-y-2 px-4 pb-4 text-sm text-slate-700">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <Sparkles className="h-4 w-4 text-indigo-500" /> Preview
              </div>
              <p className="text-slate-700">{preview(entry)}</p>
            </div>
          </Card>
        ))}
      </div>
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={onDelete}
        confirmLabel="Delete"
        confirmVariant="danger"
        title="Delete this changelog?"
        description="This action cannot be undone."
      />
    </div>
  );
}
