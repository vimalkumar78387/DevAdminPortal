import { AnswerList } from "@/components/answer-list";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { getPostWithAnswers } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DeletePostButton } from "@/components/delete-post-button";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const data = await getPostWithAnswers(postId);
  if (!data) return notFound();

  const { post, answers } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={post.title}
        subtitle={`Client ${post.clientCode ?? "n/a"} • ${formatDate(post.createdAt)} • ${post.status}`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800"
              href="/admin/community/posts"
            >
              <ArrowLeft className="h-4 w-4" /> Back to list
            </Link>
            <DeletePostButton postId={post.id} title={post.title} />
          </div>
        }
      />

      <Card>
        <CardHeader title="Details" description="Full post content and metadata" />
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          <Badge variant="muted">Status: {post.status}</Badge>
          <Badge variant="muted">Category: {post.categoryId ?? "n/a"}</Badge>
          <Badge variant="muted">Client: {post.clientCode ?? "n/a"}</Badge>
          <Badge variant="muted">Views: {post.views}</Badge>
          <Badge variant="muted">Likes: {post.likes}</Badge>
          {post.pinned ? <Badge variant="success">Pinned</Badge> : null}
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-slate-500">Created {formatDate(post.createdAt)} • Updated {formatDate(post.updatedAt)}</p>
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}
        </div>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-800">
          {post.body}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Answers"
          description={`All replies to this post (${answers.length})`}
        />
        <AnswerList postId={post.id} initialAnswers={answers} />
      </Card>
    </div>
  );
}
