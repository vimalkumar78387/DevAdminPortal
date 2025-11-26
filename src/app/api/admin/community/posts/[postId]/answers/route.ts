import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAnswersForPost } from "@/lib/posts";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const jar = await cookies();
  const session = await verifySessionToken(jar.get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const answers = await getAnswersForPost(postId);
  return NextResponse.json({ answers });
}
