import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { listChangelog } from "@/lib/changelog";

export const runtime = "nodejs";

export async function GET() {
  const jar = await cookies();
  const session = await verifySessionToken(jar.get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const changelog = await listChangelog();
  return NextResponse.json({ changelog });
}
