import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E テスト設定
 * TR-STACK-008 に対応
 * CI では chromium のみ実行（WebKit/Firefox は別途インストールが必要なためローカル専用）
 */
export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:4173",
        trace: "on-first-retry",
    },
    projects: process.env.CI
        ? [
            /* CI: Chromium のみ（インストール済みのブラウザのみ実行） */
            {
                name: "chromium",
                use: { ...devices["Desktop Chrome"] },
            },
        ]
        : [
            /* ローカル: Desktop + スマホブラウザ（NFR-002 対応） */
            {
                name: "chromium",
                use: { ...devices["Desktop Chrome"] },
            },
            {
                name: "Mobile Chrome",
                use: { ...devices["Pixel 5"] },
            },
            {
                name: "Mobile Safari",
                use: { ...devices["iPhone 14"] },
            },
        ],
    /* pnpm preview でビルド済みを配信（CI・ローカル共通） */
    webServer: {
        command: "pnpm preview",
        url: "http://localhost:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 60 * 1000,
    },
});
