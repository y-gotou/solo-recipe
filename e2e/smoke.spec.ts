import { test, expect } from "@playwright/test";

/**
 * スモークテスト（AT-003 対応の準備）
 * アプリが起動してページが表示されることを確認する
 */
test("アプリが起動して画面が表示される", async ({ page }) => {
    await page.goto("/");
    // ページタイトルまたは body が存在することを確認
    await expect(page.locator("body")).toBeVisible();
});
