import { default as NextEnv } from "@next/env";
import { eq } from "drizzle-orm";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { accounts, products, reviews, sessions, users } from "./schema";
import {
  generateProduct,
  generateProductReviews,
  generateUser,
} from "@/utils/generators";

NextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const queryClient = postgres(process.env.DATABASE_URL!);
const db: PostgresJsDatabase = drizzle(queryClient);

void (async () => {
  // database teardown
  console.log("tearing down database");

  await db.delete(sessions);
  await db.delete(accounts);
  await db.delete(reviews);
  await db.delete(products);
  await db.delete(users);

  // database setup
  console.log("seed database with data");

  const usersData = new Array(100).fill(null).map(() => generateUser());
  const usersResp = await db.insert(users).values(usersData).returning();

  const productsData = new Array(300).fill(null).map(() => generateProduct());
  const productsResp = await db
    .insert(products)
    .values(productsData)
    .returning();

  for (const product of productsResp) {
    const reviewsData = generateProductReviews(
      product.id,
      usersResp.map(({ id }) => id),
    );

    if (reviewsData.length) {
      const reviewsResp = await db
        .insert(reviews)
        .values(reviewsData)
        .returning();
      await db
        .update(products)
        .set({
          reviewCount: reviewsResp.length,
          rating:
            reviewsResp.reduce((acc, review) => acc + review.rating, 0) /
            reviewsResp.length,
        })
        .where(eq(products.id, product.id));
    }
  }

  process.exit(0);
})();
