import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deletePost } from "@/lib/posts";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { recordActivity } from "@/lib/logger";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const jar = await cookies();
  const session = await verifySessionToken(jar.get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const deleted = await deletePost(postId);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await recordActivity({
    adminUsername: session.username,
    action: "delete_post",
    targetType: "post",
    targetId: postId,
  });

  return NextResponse.json({ success: true });
}
