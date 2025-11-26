import { z } from "zod";

export const postsQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  category: z.string().trim().max(120).optional(),
  status: z
    .enum(["open", "pending", "published", "draft", "archived"] as const)
    .optional(),
  page: z.coerce.number().int().min(1).max(200).default(1),
  pageSize: z.coerce.number().int().min(5).max(50).default(10),
});

export type PostsQueryInput = z.infer<typeof postsQuerySchema>;
