import { describe, it, expect } from "vitest";
import { getCurrentMonthKey, DEFAULT_MEAL_BUDGET, SETUP_COMPLETED_KEY } from "./constants";

describe("constants", () => {
    it("DEFAULT_MEAL_BUDGET が 400 であること（TR-DATA-001）", () => {
        expect(DEFAULT_MEAL_BUDGET).toBe(400);
    });

    it("SETUP_COMPLETED_KEY が setupCompleted であること（TR-DB-004）", () => {
        expect(SETUP_COMPLETED_KEY).toBe("setupCompleted");
    });

    it("getCurrentMonthKey が YYYY-MM 形式を返すこと（TR-AGG-001）", () => {
        const key = getCurrentMonthKey();
        expect(key).toMatch(/^\d{4}-\d{2}$/);
    });
});
