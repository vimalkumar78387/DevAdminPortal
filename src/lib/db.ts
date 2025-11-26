import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getEnv } from "./env";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: Pool | undefined;
}

const env = getEnv();

const pool = globalThis.__dbPool ?? new Pool({ connectionString: env.POSTGRES_URL });

if (!globalThis.__dbPool) {
  globalThis.__dbPool = pool;
}

export const db = drizzle(pool, { schema });
export type DbClient = typeof db;
