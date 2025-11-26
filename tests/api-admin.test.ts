import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  verifySessionToken: vi.fn(),
  listPosts: vi.fn(),
  deletePost: vi.fn(),
  deleteAnswer: vi.fn(),
  recordActivity: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: mocks.cookies,
}));

vi.mock("@/lib/session", () => ({
  SESSION_COOKIE_NAME: "admin_session",
  verifySessionToken: mocks.verifySessionToken,
}));

vi.mock("@/lib/posts", () => ({
  listPosts: mocks.listPosts,
  deletePost: mocks.deletePost,
  deleteAnswer: mocks.deleteAnswer,
  getDashboardSummary: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  recordActivity: mocks.recordActivity,
}));

import * as postsRoute from "@/app/api/admin/community/posts/route";
import * as deletePostRoute from "@/app/api/admin/community/posts/[postId]/route";
import * as deleteAnswerRoute from "@/app/api/admin/community/posts/[postId]/answers/[answerId]/route";

describe("admin APIs", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("GET /posts rejects when unauthenticated", async () => {
    mocks.cookies.mockReturnValue({ get: () => undefined });
    mocks.verifySessionToken.mockResolvedValue(null);

    const res = await postsRoute.GET(new Request("http://localhost/api"));
    expect(res.status).toBe(403);
  });

  test("GET /posts returns data when authenticated", async () => {
    mocks.cookies.mockReturnValue({ get: () => ({ value: "token" }) });
    mocks.verifySessionToken.mockResolvedValue({ username: "vimal", issuedAt: Date.now() });
    mocks.listPosts.mockResolvedValue({ posts: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 } });

    const res = await postsRoute.GET(new Request("http://localhost/api"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.pagination.total).toBe(0);
  });

  test("DELETE /posts/:id logs activity", async () => {
    mocks.cookies.mockReturnValue({ get: () => ({ value: "token" }) });
    mocks.verifySessionToken.mockResolvedValue({ username: "vimal", issuedAt: Date.now() });
    mocks.deletePost.mockResolvedValue({ id: "123" });

    const res = await deletePostRoute.DELETE(new Request("http://localhost/api"), {
      params: { postId: "123" },
    });
    expect(res.status).toBe(200);
    expect(mocks.recordActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "delete_post", targetId: "123" })
    );
  });

  test("DELETE /answers/:id requires auth", async () => {
    mocks.cookies.mockReturnValue({ get: () => undefined });
    mocks.verifySessionToken.mockResolvedValue(null);

    const res = await deleteAnswerRoute.DELETE(new Request("http://localhost/api"), {
      params: { postId: "p1", answerId: "a1" },
    });
    expect(res.status).toBe(403);
  });
});
