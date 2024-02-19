import { default as NextEnv } from "@next/env";
import { eq } from "drizzle-orm";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { accounts, products, reviews, sessions, users } from "./schema";
import { generateProduct, generateProductReviews, generateUser } from "@/utils/generators";

NextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const queryClient = postgres(process.env.DATABASE_URL!);
const db: PostgresJsDatabase = drizzle(queryClient);

function chunk<T>(array: T[], chunkSize = 1, cache: T[][] = []) {
  const tmp = [...array];
  if (chunkSize <= 0) return cache;
  while (tmp.length) cache.push(tmp.splice(0, chunkSize));
  return cache;
}

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
  const productsResp = await db.insert(products).values(productsData).returning();

  const reviewsData = productsResp.flatMap((product) =>
    generateProductReviews(
      product.id,
      usersResp.map(({ id }) => id),
    ),
  );

  const reviewsDataChunks = chunk(reviewsData, 100);

  for (const reviewsDataChunk of reviewsDataChunks) {
    if (reviewsData.length) {
      await db.insert(reviews).values(reviewsDataChunk).returning();
    }
  }

  for (const product of productsResp) {
    const reviews = reviewsData.filter((review) => review.productId === product.id);
    await db
      .update(products)
      .set({
        reviewCount: reviews.length,
        rating: reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length,
      })
      .where(eq(products.id, product.id));
  }

  process.exit(0);
})();
