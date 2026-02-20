import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E テスト設定
 * TR-STACK-008 に対応
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
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        /* スマホブラウザ（NFR-002 対応） */
        {
            name: "Mobile Chrome",
            use: { ...devices["Pixel 5"] },
        },
        {
            name: "Mobile Safari",
            use: { ...devices["iPhone 14"] },
        },
    ],
    /* CI では vite preview を使う（ビルド済み） */
    webServer: {
        command: "pnpm preview",
        url: "http://localhost:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 60 * 1000,
    },
});
