import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { changelogEntries, ChangelogEntry } from "./schema";
import { ChangelogInput } from "./validators";

function normalizeLower(value: string) {
  return value.toLowerCase();
}

export async function listChangelog(): Promise<ChangelogEntry[]> {
  return db.query.changelogEntries.findMany({
    orderBy: [desc(changelogEntries.releaseDate), desc(changelogEntries.createdAt)],
  });
}

export async function getChangelog(id: string) {
  return db.query.changelogEntries.findFirst({
    where: eq(changelogEntries.id, id),
  });
}

export async function createChangelog(input: ChangelogInput) {
  const [created] = await db
    .insert(changelogEntries)
    .values({
      version: input.version,
      productName: input.productName,
      releaseDate: new Date(input.releaseDate),
      releaseType: normalizeLower(input.releaseType),
      status: normalizeLower(input.status),
      added: input.added ?? [],
      improved: input.improved ?? [],
      fixed: input.fixed ?? [],
      security: input.security ?? [],
      deprecated: input.deprecated ?? [],
      breaking: input.breaking ?? [],
      apiChanges: input.apiChanges ?? [],
      migrationTitle: input.migrationTitle,
      migrationDescription: input.migrationDescription,
      migrationCode: input.migrationCode,
      tags: input.tags ?? [],
      docsUrl: input.docsUrl,
    })
    .returning();

  return created;
}

export async function deleteChangelog(id: string) {
  const [deleted] = await db
    .delete(changelogEntries)
    .where(eq(changelogEntries.id, id))
    .returning({ id: changelogEntries.id });
  return deleted;
}
