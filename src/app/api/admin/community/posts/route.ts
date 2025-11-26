import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { listPosts } from "@/lib/posts";
import { postsQuerySchema } from "@/lib/validators";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const jar = await cookies();
  const session = await verifySessionToken(jar.get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = postsQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const data = await listPosts(parsed.data);
  return NextResponse.json(data);
}
