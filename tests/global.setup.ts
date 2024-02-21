import { test as setup } from "@playwright/test";
import { insertUser } from "./utils";

setup("create test user", async ({ page }) => {
  await insertUser({ id: "test" });
});
