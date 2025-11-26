"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { Trash2 } from "lucide-react";

export function DeletePostButton({ postId, title }: { postId: string; title: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/community/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });

    setLoading(false);
    setOpen(false);

    if (res.ok) {
      toast.success("Discussion deleted");
      router.push("/admin/community/posts");
      router.refresh();
    } else {
      toast.error("Failed to delete post");
    }
  };

  return (
    <>
      <Button
        variant="danger"
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" /> Delete post
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        confirmLabel={loading ? "Deleting..." : "Delete"}
        confirmVariant="danger"
        title={`Delete '${title}'?`}
        description="This removes the post and all answers from the public portal."
      />
    </>
  );
}
