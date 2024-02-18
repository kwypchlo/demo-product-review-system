import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/env.js";

export const db = drizzle(postgres(env.DATABASE_URL), { schema });
