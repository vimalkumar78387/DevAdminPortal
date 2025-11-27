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

export const changelogInputSchema = z.object({
  version: z.string().trim().min(1).max(50),
  productName: z.string().trim().min(1).max(255),
  releaseDate: z.string().datetime().or(z.string().min(1)),
  releaseType: z.enum(["Major", "Minor", "Patch", "major", "minor", "patch"]),
  status: z.enum(["Latest", "Stable", "Deprecated", "latest", "stable", "deprecated"]),
  added: z.array(z.string().trim()).default([]),
  improved: z.array(z.string().trim()).default([]),
  fixed: z.array(z.string().trim()).default([]),
  security: z.array(z.string().trim()).default([]),
  deprecated: z.array(z.string().trim()).default([]),
  breaking: z.array(z.string().trim()).default([]),
  apiChanges: z
    .array(
      z.object({
        endpoint: z.string().trim().min(1),
        description: z.string().trim().min(1),
        impact: z.enum(["Breaking", "Non-breaking", "breaking", "non-breaking"]),
      })
    )
    .default([]),
  migrationTitle: z.string().trim().max(255).optional(),
  migrationDescription: z.string().trim().optional(),
  migrationCode: z.string().optional(),
  tags: z.array(z.string().trim()).default([]),
  docsUrl: z.string().url().optional(),
});

export type ChangelogInput = z.infer<typeof changelogInputSchema>;
