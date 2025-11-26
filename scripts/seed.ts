import { db } from "../src/lib/db";
import { communityAnswers, communityPosts } from "../src/lib/schema";

async function main() {
  const [post] = await db
    .insert(communityPosts)
    .values({
      title: "UPI AutoPay issue",
      body: "Merchant callbacks are failing intermittently on AutoPay. Please investigate logs.",
      tags: ["upi", "autopay", "callbacks"],
      categoryId: "payments",
      clientCode: "SAB-BETA",
      status: "published",
      pinned: true,
    })
    .onConflictDoNothing()
    .returning();

  if (post) {
    await db.insert(communityAnswers).values([
      {
        postId: post.id,
        userId: "sabpaisa-support",
        content: "We are rolling out a fix to the webhook retrier; ETA 1 hour.",
        likes: 4,
        isAccepted: true,
      },
      {
        postId: post.id,
        userId: "merchant-dev",
        content: "Seeing fewer failures after 12:00 IST. Monitoring.",
        likes: 2,
        dislikes: 0,
      },
    ]);
  }

  console.log("Seed complete");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
