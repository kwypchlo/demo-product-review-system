import { default as NextEnv } from "@next/env";
import { eq } from "drizzle-orm";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { generateProduct, generateProductReviews, generateUser } from "./generators";
import { accounts, products, reviews, sessions, users } from "./schema";

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
  // reusing images because regenerating image cache on every redeploy causes vercel's fair usage policy to be exceeded
  console.log("collecting previous images to reuse");
  const prevProductData = await db.selectDistinctOn([products.image], { image: products.image }).from(products);
  const prevUserData = await db.selectDistinctOn([users.image], { image: users.image }).from(users);

  // database teardown
  console.log("tearing down database");
  await db.delete(sessions);
  await db.delete(accounts);
  await db.delete(reviews);
  await db.delete(products);
  await db.delete(users);

  // database setup
  console.log("seed database with data");

  const testUser = generateUser({ ...prevUserData.pop(), id: "test" }); // generate one user with known id for dev auth
  const usersData = new Array(99)
    .fill(null)
    .map(() => generateUser(prevUserData.pop()))
    .concat(testUser);
  const productsData = new Array(300).fill(null).map(() => generateProduct(prevProductData.pop()));

  console.log("·", `inserting ${usersData.length} users`);
  const usersResp = await db.insert(users).values(usersData).returning();

  console.log("·", `inserting ${productsData.length} products`);
  const productsResp = await db.insert(products).values(productsData).returning();

  const reviewsData = productsResp.flatMap((product) =>
    generateProductReviews(
      product.id,
      usersResp.map(({ id }) => id).filter((id) => id !== testUser.id), // exclude the known user for dev auth
    ),
  );

  console.log("·", `inserting ${reviewsData.length} reviews`);
  const reviewsDataChunks = chunk(reviewsData, 100);
  for (const reviewsDataChunk of reviewsDataChunks) {
    if (reviewsDataChunk.length) {
      await db.insert(reviews).values(reviewsDataChunk);
    }
  }

  console.log("·", "updating products with review count and rating");
  for (const product of productsResp) {
    const reviews = reviewsData.filter((review) => review.productId === product.id);

    await db
      .update(products)
      .set({
        reviewCount: reviews.length,
        rating: reviews.length ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0,
      })
      .where(eq(products.id, product.id));
  }

  console.log("done");
  process.exit(0);
})();
