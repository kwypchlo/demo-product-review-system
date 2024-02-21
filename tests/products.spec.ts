import { expect, test } from "@playwright/test";
import { insertProduct, insertReview } from "./utils";

test("should display product cards on main page", async ({ page }) => {
  await insertProduct();

  await page.goto("/");

  const productCard = page.getByTestId("product-card").first();

  // expect product card to be visible
  await expect(productCard).toBeVisible();

  // expect product card to have a name
  await expect(productCard.getByTestId("product-card-name")).not.toBeEmpty();

  // expect product card to have a reviews count
  await expect(productCard.getByTestId("product-card-review-count")).toHaveText(/\d+ Reviews/);

  // expect product card to have a rating component rendered
  await expect(productCard.getByTestId("product-card-rating").getByRole("img")).toHaveAttribute(
    "aria-label",
    /[\d.]+ on 5/,
  );
});

test("should navigate to product page when clicking on a product card", async ({ page }) => {
  const product = await insertProduct({ rating: 3, reviewCount: 2 });
  await Promise.all([
    insertReview(product.id, undefined, { rating: 2 }),
    insertReview(product.id, undefined, { rating: 4 }),
  ]);

  await page.goto("/");

  // click on the first product card name
  await page.getByText(product.name).first().click();

  // expect to navigate to product page
  await expect(page).toHaveURL("/product/" + product.id);

  // expect product name to be displayed on the product page
  await expect(page.getByText(product.name)).toBeVisible();

  // expect product card to have a rating
  await expect(page.getByText("3 out of 2 reviews")).toBeVisible();
});
