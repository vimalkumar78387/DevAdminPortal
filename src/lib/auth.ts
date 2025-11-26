import { cookies, type RequestCookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEnv } from "./env";
import {
  AdminSession,
  SESSION_COOKIE_NAME,
  createSessionToken,
  getSessionCookieOptions,
  verifySessionToken,
} from "./session";

export function validateAdminCredentials(username: string, password: string) {
  const env = getEnv();
  return (
    username.trim() === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD
  );
}

export async function setAdminSession(
  username: string,
  cookieStore?: RequestCookies | Promise<RequestCookies>
) {
  const token = await createSessionToken(username);
  const jar = cookieStore ? await cookieStore : await cookies();
  jar.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, "", {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const cookie = jar.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(cookie);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}
