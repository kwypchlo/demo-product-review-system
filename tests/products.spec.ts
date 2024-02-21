import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("should display at least one product card", async ({ page }) => {
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
  const productCardName = await page.getByTestId("product-card-name").first().textContent();

  // expect product card to have a name
  expect(productCardName).not.toBeNull();

  // click on the first product card name
  await page.getByTestId("product-card-name").first().click();

  // expect to navigate to product page
  await expect(page).toHaveURL(/\/product\/[0-9a-f-]+/);

  // expect product name to be displayed on the product page
  await expect(page.getByTestId("product-name")).toHaveText(productCardName!);
});
