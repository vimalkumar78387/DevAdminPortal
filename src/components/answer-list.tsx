"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Badge } from "./ui/badge";
import { formatDate } from "@/lib/utils";
import { CommunityAnswer } from "@/lib/schema";
import { ThumbsDown, ThumbsUp } from "lucide-react";

export function AnswerList({
  postId,
  initialAnswers,
}: {
  postId: string;
  initialAnswers: CommunityAnswer[];
}) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [deleteTarget, setDeleteTarget] = useState<CommunityAnswer | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    setAnswers((prev) => prev.filter((a) => a.id !== target.id));

    const res = await fetch(
      `/api/admin/community/posts/${postId}/answers/${target.id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      toast.error("Failed to delete answer");
      setAnswers((prev) => [...prev, target]);
    } else {
      toast.success("Answer deleted");
    }
  };

  if (!answers.length) {
    return <p className="text-sm text-slate-600">No answers yet.</p>;
  }

  return (
    <div className="space-y-3">
      {answers.map((answer) => (
        <div
          key={answer.id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Badge variant={answer.isAccepted ? "success" : "muted"}>
                {answer.isAccepted ? "Accepted" : "Not accepted"}
              </Badge>
              <span>Author: {answer.userId ?? "—"}</span>
              <span>{formatDate(answer.createdAt)}</span>
            </div>
            <Button
              variant="danger"
              onClick={() => setDeleteTarget(answer)}
              className="px-3 py-1 text-xs"
            >
              Delete answer
            </Button>
          </div>
          <p className="mt-3 text-sm text-slate-800">{answer.content}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{answer.likes}</span>
            <span className="inline-flex items-center gap-1"><ThumbsDown className="h-4 w-4" />{answer.dislikes}</span>
          </div>
        </div>
      ))}

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this answer?"
        confirmLabel="Delete"
        confirmVariant="danger"
        description="This will remove the answer from the public portal immediately."
      >
        <p className="text-sm text-slate-600">
          Please confirm you want to remove this answer. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
