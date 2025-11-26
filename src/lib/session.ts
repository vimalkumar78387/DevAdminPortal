import { getEnv } from "./env";

export const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export type AdminSession = {
  username: string;
  issuedAt: number;
};

function base64UrlEncode(input: string | ArrayBuffer) {
  if (typeof input === "string") {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(input, "utf8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }
    // browser/edge
    const encoded = btoa(input);
    return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  const bytes = new Uint8Array(input);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): string | null {
  try {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    if (typeof Buffer !== "undefined") {
      return Buffer.from(base64, "base64").toString("utf8");
    }
    return atob(base64);
  } catch (error) {
    console.error("Failed to decode base64url", error);
    return null;
  }
}

function encodePayload(payload: AdminSession) {
  return base64UrlEncode(JSON.stringify(payload));
}

function decodePayload(encoded: string): AdminSession | null {
  const raw = base64UrlDecode(encoded);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch (error) {
    console.error("Failed to parse session payload", error);
    return null;
  }
}

async function hmac(data: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return base64UrlEncode(signature);
}

export async function createSessionToken(username: string) {
  const env = getEnv();
  const payload = encodePayload({ username, issuedAt: Date.now() });
  const signature = await hmac(payload, env.ADMIN_SESSION_SECRET);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(
  token?: string
): Promise<AdminSession | null> {
  if (!token) return null;
  const env = getEnv();
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = await hmac(payload, env.ADMIN_SESSION_SECRET);
  if (signature.length !== expected.length || signature !== expected) {
    return null;
  }
  const session = decodePayload(payload);
  if (!session) return null;
  if (session.username !== env.ADMIN_USERNAME) {
    return null;
  }
  const expired =
    Date.now() - session.issuedAt > SESSION_TTL_SECONDS * 1000;
  if (expired) {
    return null;
  }
  return session;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
