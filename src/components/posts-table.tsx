"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Modal } from "./ui/modal";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatDate, truncate } from "@/lib/utils";
import { CommunityPost } from "@/lib/schema";
import { PostsQueryInput } from "@/lib/validators";
import { Tag, Folder, Calendar, Trash2, Eye } from "lucide-react";

const defaultFilters: PostsQueryInput = {
  search: undefined,
  category: undefined,
  status: undefined,
  page: 1,
  pageSize: 10,
};

type ApiResponse = {
  posts: Array<CommunityPost & { replyCount: number }>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

function buildQuery(filters: PostsQueryInput) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  params.set("page", String(filters.page ?? 1));
  params.set("pageSize", String(filters.pageSize ?? 10));
  return params.toString();
}

export function PostsTable() {
  const [filters, setFilters] = useState<PostsQueryInput>(defaultFilters);
  const [deleteTarget, setDeleteTarget] = useState<CommunityPost & { replyCount: number } | null>(null);

  const queryKey = useMemo(() => `/api/admin/community/posts?${buildQuery(filters)}`, [filters]);

  const { data, error, isValidating, mutate } = useSWR<ApiResponse>(queryKey);

  const onDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    if (!data) return;
    // optimistic
    mutate(
      {
        ...data,
        posts: data.posts.filter((post) => post.id !== target.id),
        pagination: {
          ...data.pagination,
          total: Math.max(data.pagination.total - 1, 0),
        },
      },
      { revalidate: false }
    );

    const res = await fetch(`/api/admin/community/posts/${target.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      toast.success("Discussion deleted");
      mutate();
    } else {
      toast.error("Failed to delete. Try again.");
      mutate();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search by title, body, client code"
            value={filters.search ?? ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, page: 1, search: e.target.value || undefined }))}
          />
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            value={filters.status ?? ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, page: 1, status: e.target.value || undefined }))}
          >
            <option value="">Status</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <Input
            placeholder="Category"
            value={filters.category ?? ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, page: 1, category: e.target.value || undefined }))}
            className="hidden sm:block"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">Page {data?.pagination.page ?? filters.page}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{data?.pagination.total ?? 0} results</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tags</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Client</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Replies</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Updated</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm">
            {data?.posts?.map((post) => (
              <tr key={post.id} className="transition hover:bg-indigo-50">
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-indigo-500" />
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-500">{truncate(post.body, 90)}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 flex items-center gap-1">
                  <Folder className="h-4 w-4 text-emerald-500" />
                  {post.categoryId ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(post.tags || []).slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="muted" className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-slate-500" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{post.clientCode ?? "—"}</td>
                <td className="px-4 py-3 text-slate-700">{post.replyCount ?? 0}</td>
                <td className="px-4 py-3 text-slate-700 flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  {formatDate(post.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                      href={`/admin/community/posts/${post.id}`}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => setDeleteTarget(post)}
                      aria-label={`Delete ${post.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {data?.posts?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={7}>
                  No posts found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {error ? (
          <p className="px-4 py-3 text-sm text-red-600">Failed to load posts: {String(error)}</p>
        ) : null}
        {isValidating && !data ? (
          <p className="px-4 py-3 text-sm text-slate-600">Loading posts…</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <div>
          Showing {(data?.posts.length ?? 0)} of {data?.pagination.total ?? 0}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={(filters.page ?? 1) <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={(data?.pagination.totalPages ?? 1) <= (filters.page ?? 1)}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
          >
            Next
          </Button>
        </div>
      </div>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        confirmLabel="Delete"
        confirmVariant="danger"
        title={deleteTarget ? `Delete '${deleteTarget.title}'?` : "Delete"}
        description="This will remove the discussion and all associated answers."
      >
        <p className="text-sm text-slate-600">
          This action is immediate and will also reflect on the public developer portal.
        </p>
      </Modal>
    </div>
  );
}
