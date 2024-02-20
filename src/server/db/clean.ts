import { default as NextEnv } from "@next/env";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { reviews } from "./schema";

NextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const queryClient = postgres(process.env.DATABASE_URL!);
const db: PostgresJsDatabase = drizzle(queryClient);

void (async () => {
  await db.delete(reviews);
  process.exit(0);
})();
