import { describe, expect, test, beforeEach } from "vitest";
import { createSessionToken, verifySessionToken } from "@/lib/session";
import { validateAdminCredentials } from "@/lib/auth";

beforeEach(() => {
  process.env.ADMIN_USERNAME = "vimal";
  process.env.ADMIN_PASSWORD = "Admin7838";
  process.env.ADMIN_SESSION_SECRET = "this-is-a-very-secure-secret-123456";
  process.env.POSTGRES_URL = "postgres://test";
});

describe("credential validation", () => {
  test("accepts correct username/password", () => {
    expect(validateAdminCredentials("vimal", "Admin7838")).toBe(true);
  });

  test("rejects incorrect combinations", () => {
    expect(validateAdminCredentials("wrong", "Admin7838")).toBe(false);
    expect(validateAdminCredentials("vimal", "wrong")).toBe(false);
  });
});

describe("session tokens", () => {
  test("creates and verifies a valid token", async () => {
    const token = await createSessionToken("vimal");
    const session = await verifySessionToken(token);
    expect(session?.username).toBe("vimal");
  });

  test("fails verification with tampered token", async () => {
    const token = await createSessionToken("vimal");
    const tampered = `${token}extra`;
    expect(await verifySessionToken(tampered)).toBeNull();
  });
});
