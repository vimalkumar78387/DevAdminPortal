import { db } from "./db";
import { adminActivityLogs } from "./schema";

export async function recordActivity(params: {
  adminUsername: string;
  action: "delete_post" | "delete_answer";
  targetType: "post" | "answer";
  targetId: string;
  details?: string;
}) {
  try {
    await db.insert(adminActivityLogs).values({
      adminUsername: params.adminUsername,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      details: params.details,
    });
  } catch (error) {
    console.error("Failed to write activity log", error);
  }
}
