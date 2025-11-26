import { and, count, desc, eq, ilike, or, sql, SQL } from "drizzle-orm";
import { db } from "./db";
import {
  adminActivityLogs,
  communityAnswers,
  communityPosts,
  CommunityPost,
} from "./schema";
import { PostsQueryInput } from "./validators";

export type PostListItem = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  categoryId: string | null;
  clientCode: string | null;
  status: string;
  pinned: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  lastReplyAt: Date | null;
  replyCount: number;
};

export async function listPosts(filters: PostsQueryInput) {
  const whereClause = buildWhereClause(filters);
  const query = db
    .select({
      id: communityPosts.id,
      title: communityPosts.title,
      body: communityPosts.body,
      tags: communityPosts.tags,
      categoryId: communityPosts.categoryId,
      clientCode: communityPosts.clientCode,
      status: communityPosts.status,
      pinned: communityPosts.pinned,
      views: communityPosts.views,
      likes: communityPosts.likes,
      createdAt: communityPosts.createdAt,
      updatedAt: communityPosts.updatedAt,
      lastReplyAt: communityPosts.lastReplyAt,
      replyCount: sql<number>`count(${communityAnswers.id})::int`,
    })
    .from(communityPosts)
    .leftJoin(communityAnswers, eq(communityAnswers.postId, communityPosts.id))
    .groupBy(communityPosts.id)
    .orderBy(desc(communityPosts.pinned), desc(communityPosts.updatedAt))
    .limit(filters.pageSize)
    .offset((filters.page - 1) * filters.pageSize);

  const posts = whereClause ? await query.where(whereClause) : await query;

  const totalResult = whereClause
    ? await db
        .select({ value: count(communityPosts.id) })
        .from(communityPosts)
        .where(whereClause)
    : await db.select({ value: count(communityPosts.id) }).from(communityPosts);

  const total = totalResult[0]?.value ?? 0;

  return {
    posts,
    pagination: {
      page: filters.page,
      pageSize: filters.pageSize,
      total,
      totalPages: Math.ceil(total / filters.pageSize) || 1,
    },
  };
}

export async function getPostWithAnswers(postId: string) {
  const post = await db.query.communityPosts.findFirst({
    where: eq(communityPosts.id, postId),
  });
  if (!post) return null;
  const answers = await db.query.communityAnswers.findMany({
    where: eq(communityAnswers.postId, postId),
    orderBy: [desc(communityAnswers.createdAt)],
  });
  return { post, answers };
}

export async function getAnswersForPost(postId: string) {
  return db.query.communityAnswers.findMany({
    where: eq(communityAnswers.postId, postId),
    orderBy: [desc(communityAnswers.createdAt)],
  });
}

export async function deletePost(postId: string) {
  const [deleted] = await db
    .delete(communityPosts)
    .where(eq(communityPosts.id, postId))
    .returning({ id: communityPosts.id });
  return deleted;
}

export async function deleteAnswer(postId: string, answerId: string) {
  const [deleted] = await db
    .delete(communityAnswers)
    .where(and(eq(communityAnswers.id, answerId), eq(communityAnswers.postId, postId)))
    .returning({ id: communityAnswers.id });
  return deleted;
}

export async function getDashboardSummary() {
  const [postCounts] = await db
    .select({
      totalPosts: count(communityPosts.id).as("total_posts"),
      publishedPosts: sql<number>`count(*) filter (where ${communityPosts.status} = 'published')::int`,
      pendingPosts: sql<number>`count(*) filter (where ${communityPosts.status} = 'pending')::int`,
    })
    .from(communityPosts);

  const [answerCounts] = await db
    .select({ totalAnswers: count(communityAnswers.id) })
    .from(communityAnswers);

  const latestActions = await db
    .select()
    .from(adminActivityLogs)
    .orderBy(desc(adminActivityLogs.createdAt))
    .limit(5);

  return {
    totalPosts: postCounts?.totalPosts ?? 0,
    publishedPosts: (postCounts as any)?.publishedPosts ?? 0,
    pendingPosts: (postCounts as any)?.pendingPosts ?? 0,
    totalAnswers: answerCounts?.totalAnswers ?? 0,
    latestActions,
  };
}

function buildWhereClause(filters: PostsQueryInput): SQL | undefined {
  const clauses: SQL[] = [];
  if (filters.search) {
    const searchValue = `%${filters.search}%`;
    clauses.push(
      or(
        ilike(communityPosts.title, searchValue),
        ilike(communityPosts.body, searchValue),
        ilike(communityPosts.clientCode, searchValue),
        sql`array_to_string(${communityPosts.tags}, ',') ILIKE ${searchValue}`
      )
    );
  }
  if (filters.category) {
    clauses.push(eq(communityPosts.categoryId, filters.category));
  }
  if (filters.status) {
    clauses.push(eq(communityPosts.status, filters.status));
  }
  if (!clauses.length) {
    return undefined;
  }
  return and(...clauses);
}
