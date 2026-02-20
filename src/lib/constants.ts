/**
 * アプリ全体で使用する定数・型定義
 * TR-DB-004, TR-DATA-001 に対応
 */

/** 初回セットアップ完了フラグのキー（localStorage） */
export const SETUP_COMPLETED_KEY = "setupCompleted" as const;

/** 月キーのフォーマット（YYYY-MM, Asia/Tokyo） */
export const MONTH_KEY_TIMEZONE = "Asia/Tokyo" as const;

/** 1食予算の初期値（円）- TR-DATA-001 */
export const DEFAULT_MEAL_BUDGET = 400;

/** 提案対象食事種別（固定）- TR-REC-001 */
export const MEAL_TYPE = "dinner" as const;

/** IndexedDB エラーコード - TR-DB-006 */
export type StorageErrorCode =
    | "DB_INIT_FAILED"
    | "DB_READ_FAILED"
    | "DB_WRITE_FAILED";

/** 月次集計型 - TR-AGG-001, TR-AGG-002 */
export type MonthlyAggregation = {
    /** YYYY-MM 形式（Asia/Tokyo） */
    monthKey: string;
    /** 基準月額食費 */
    baseline: number;
    /** 実績食費 */
    actual: number;
    /** 削減額（baseline - actual） */
    saving: number;
};

/**
 * 現在の月キーを YYYY-MM 形式（Asia/Tokyo）で返す
 */
export function getCurrentMonthKey(): string {
    return new Intl.DateTimeFormat("ja-JP", {
        timeZone: MONTH_KEY_TIMEZONE,
        year: "numeric",
        month: "2-digit",
    })
        .format(new Date())
        .replace("/", "-");
}
