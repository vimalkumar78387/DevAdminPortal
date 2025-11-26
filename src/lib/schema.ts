import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  serial,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const communityPosts = pgTable(
  "community_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),
    tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
    categoryId: varchar("category_id", { length: 50 }).notNull(),
    clientCode: varchar("client_code", { length: 10 })
      .notNull()
      .default("0000"),
    status: varchar("status", { length: 20 }).notNull().default("open"),
    views: integer("views").notNull().default(0),
    likes: integer("likes").notNull().default(0),
    pinned: boolean("pinned").notNull().default(false),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    lastReplyAt: timestamp("last_reply_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    categoryIdx: index("community_posts_category_idx").on(table.categoryId),
    statusIdx: index("community_posts_status_idx").on(table.status),
  })
);

export const communityAnswers = pgTable(
  "community_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => communityPosts.id, { onDelete: "cascade" }),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    content: text("content").notNull(),
    likes: integer("likes").notNull().default(0),
    dislikes: integer("dislikes").notNull().default(0),
    isAccepted: boolean("is_accepted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    postIdx: index("community_answers_post_idx").on(table.postId),
  })
);

export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminUsername: varchar("admin_username", { length: 150 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  targetType: varchar("target_type", { length: 50 }).notNull(),
  targetId: uuid("target_id").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const communityPostsRelations = relations(communityPosts, ({ many, one }) => ({
  answers: many(communityAnswers),
  author: one(users, {
    fields: [communityPosts.userId],
    references: [users.id],
  }),
}));

export const communityAnswersRelations = relations(
  communityAnswers,
  ({ one }) => ({
    post: one(communityPosts, {
      fields: [communityAnswers.postId],
      references: [communityPosts.id],
    }),
  })
);

export type CommunityPost = typeof communityPosts.$inferSelect;
export type CommunityAnswer = typeof communityAnswers.$inferSelect;
export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;
