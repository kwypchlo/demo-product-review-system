import { type Page, expect } from "@playwright/test";
import { db } from "@/server/db";
import { generateProduct, generateReview, generateUser } from "@/server/db/generators";
import { products, reviews, users } from "@/server/db/schema";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export async function authenticate(page: Page) {
  // authenticate as dev
  await page.getByRole("button", { name: "Sign in with Dev" }).click();

  // wait until authentication is complete
  await expect(page.getByRole("button", { name: /Sign out/ })).toBeVisible();

  // delay to allow the UI to update before next interactions
  await page.waitForTimeout(1000);
}

export async function insertProduct(product = {}) {
  const images = await db.selectDistinctOn([products.image], { image: products.image }).from(products);
  const image = images[getRandomInt(images.length)]; // reuse existing image randomly

  const [result] = await db
    .insert(products)
    .values(generateProduct({ ...image, ...product }))
    .returning();

  return result!;
}

export async function insertReview(productId: string, authorId?: string, overrides = {}) {
  if (!authorId) {
    authorId = (await insertUser()).id;
  }

  const [result] = await db
    .insert(reviews)
    .values(generateReview(productId, authorId, overrides))
    .returning();

  return result!;
}

export async function insertUser(overrides = {}) {
  const images = await db.selectDistinctOn([users.image], { image: users.image }).from(users);
  const image = images[getRandomInt(images.length)]; // reuse existing image randomly

  const [result] = await db
    .insert(users)
    .values(generateUser({ ...image, ...overrides }))
    .returning();

  return result!;
}
