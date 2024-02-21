import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("should allow signing in and signing out", async ({ page }) => {
  // expect sign in buttons to be visible
  await expect(page.getByRole("button", { name: "Sign in with GitHub" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in with Dev" })).toBeVisible();

  // expect sign out button to not be visible
  await expect(page.getByRole("button", { name: /Sign out/ })).not.toBeVisible();

  // NOTE: when running fresh next dev server, sign in button is not immediately available
  await page.waitForTimeout(3000);

  // sign in as dev
  await page.getByRole("button", { name: "Sign in with Dev" }).click();

  // expect sign out button to be visible
  await expect(page.getByRole("button", { name: /Sign out/ })).toBeVisible();

  // expect sign in buttons to disappear
  await expect(page.getByRole("button", { name: "Sign in with GitHub" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in with Dev" })).not.toBeVisible();

  // sign out
  await page.getByRole("button", { name: /Sign out/ }).click();

  // expect sign in buttons to reappear
  await expect(page.getByRole("button", { name: "Sign in with GitHub" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in with Dev" })).toBeVisible();

  // expect sign out button to disappear
  await expect(page.getByRole("button", { name: /Sign out/ })).not.toBeVisible();
});
