import { expect, test } from "@playwright/test";
import { authenticate, insertProduct } from "./utils";

test("should be able to post a review by authenticated user", async ({ page }) => {
  const product = await insertProduct();

  await page.goto("/product/" + product.id);

  // change to the review tab
  await page.getByRole("tab", { name: "Your Review" }).click();

  // expect the review form to be hidden and the message to be displayed
  await expect(page.getByPlaceholder("Write your review here")).toBeHidden();
  await expect(page.getByText(/You have to be signed in to submit a review/)).toBeVisible();

  // authenticate the user
  await authenticate(page);

  // change to the review tab
  await page.getByRole("tab", { name: "Your Review" }).click();

  // expect the review form to be visible and the message to be hidden
  await expect(page.getByPlaceholder("Write your review here")).toBeVisible();
  await expect(page.getByText(/You have to be signed in to submit a review/)).toBeHidden();

  // rate with 4 stars, write a review and submit
  await page.getByLabel("Rate 4").click();
  await page.getByPlaceholder("Write your review here").fill("This is a great product");
  await page.getByRole("button", { name: "Submit" }).click();

  // wait for the review to be posted confirmation to appear
  await expect(page.getByText("Your review has been submitted.")).toBeVisible();

  // assert that the review is visible and has the correct content
  await expect(page.getByTestId("review").getByRole("img", { name: "Rated 4 on" })).toBeVisible();
  await expect(page.getByTestId("review").getByText("This is a great product")).toBeVisible();
});
