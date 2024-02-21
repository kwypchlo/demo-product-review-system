import { expect, test } from "@playwright/test";
import { insertProduct, insertReview } from "./utils";

test("should display product cards on main page", async ({ page }) => {
  const product = await insertProduct({ rating: 3, reviewCount: 2 });
  await Promise.all([
    insertReview(product.id, undefined, { rating: 2 }),
    insertReview(product.id, undefined, { rating: 4 }),
  ]);

  await page.goto("/");

  // expect product card to be visible
  await expect(page.getByTestId("product-card").first()).toBeVisible();

  // expect product card to have a name
  await expect(page.getByTestId("product-card-name").first()).not.toBeEmpty();

  // expect product card to have a reviews count
  await expect(page.getByTestId("product-card").first()).toContainText(/\d+ Reviews/);
});

test("should navigate to product page when clicking on a product card", async ({ page }) => {
  const product = await insertProduct({ rating: 3, reviewCount: 2 });
  await Promise.all([
    insertReview(product.id, undefined, { rating: 2 }),
    insertReview(product.id, undefined, { rating: 4 }),
  ]);

  await page.goto("/");

  // click on the first product card name
  await page.getByTestId("product-card-name").first().click();

  // expect to navigate to product page
  await expect(page).toHaveURL(/\/product\/[0-9a-f-]+/);

  // expect product card to have a rating
  await expect(page.getByText(/[\d.]+ out of \d+ reviews/)).toBeVisible();
});
