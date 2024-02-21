import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("should allow signing in and signing out", async ({ page }) => {
  // expect sign in buttons to be visible
  await expect(page.getByRole("button", { name: "Sign in with GitHub" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in as Dev" })).toBeVisible();

  // expect sign out button to not be visible
  await expect(page.getByRole("button", { name: /Sign out/ })).not.toBeVisible();

  // sign in as dev
  await page.getByRole("button", { name: "Sign in as Dev" }).click();

  // expect sign out button to be visible
  await expect(page.getByRole("button", { name: /Sign out/ })).toBeVisible();

  // expect sign in buttons to disappear
  await expect(page.getByRole("button", { name: "Sign in with GitHub" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in as Dev" })).not.toBeVisible();

  // sign out
  await page.getByRole("button", { name: /Sign out/ }).click();

  // expect sign in buttons to reappear
  await expect(page.getByRole("button", { name: "Sign in with GitHub" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in as Dev" })).toBeVisible();

  // expect sign out button to disappear
  await expect(page.getByRole("button", { name: /Sign out/ })).not.toBeVisible();
});

test("should restrict posting reviews to authenticated users", async ({ page }) => {
  await page.getByTestId("product-card-name").first().click();

  await page.getByRole("tab", { name: "Submit Your Review" }).click();

  await expect(page.getByPlaceholder("Write your review here")).toBeHidden();
  await expect(page.getByText(/You have to be signed in to submit a review/)).toBeVisible();

  await page.getByRole("button", { name: "Sign in as Dev" }).click();
  await expect(page.getByRole("button", { name: /Sign out/ })).toBeVisible();

  await page.getByRole("tab", { name: "Submit Your Review" }).click();

  await expect(page.getByPlaceholder("Write your review here")).toBeVisible();
  await expect(page.getByText(/You have to be signed in to submit a review/)).toBeHidden();
});
