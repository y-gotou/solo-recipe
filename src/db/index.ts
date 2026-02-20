/**
 * Dexie データベーススキーマ定義
 * TR-DB-001, TR-DB-003 に対応
 */
import Dexie, { type EntityTable } from "dexie";
import type { Unit } from "../domain/types";

/** 食材在庫テーブル */
export interface IngredientRecord {
    id?: number;
    /** 食材名 */
    name: string;
    /** 数量 */
    quantity: number;
    /** 単位 */
    unit: Unit;
    /** 単価（円）。未設定時は undefined */
    unitPrice?: number;
    createdAt: number;
    updatedAt: number;
}

/** 買い物リストテーブル */
export interface ShoppingItemRecord {
    id?: number;
    /** 関連レシピID（任意） */
    recipeId?: string;
    name: string;
    quantity: number;
    unit: Unit;
    /** 購入済みフラグ - FR-032 */
    checked: boolean;
    createdAt: number;
}

/** 調理ログテーブル */
export interface CookingLogRecord {
    id?: number;
    recipeId: string;
    recipeName: string;
    /** 実コスト（円） */
    actualCost: number;
    /** 調理日（タイムスタンプ） */
    cookedAt: number;
    /** 月キー（YYYY-MM, Asia/Tokyo） */
    monthKey: string;
}

/** アプリ設定テーブル */
export interface SettingRecord {
    /** 設定キー（PK） */
    key: string;
    value: string | number | boolean;
}

/** SoloRecipe データベース */
export class SoloRecipeDB extends Dexie {
    ingredients!: EntityTable<IngredientRecord, "id">;
    shoppingItems!: EntityTable<ShoppingItemRecord, "id">;
    cookingLogs!: EntityTable<CookingLogRecord, "id">;
    settings!: EntityTable<SettingRecord, "key">;

    constructor() {
        super("SoloRecipeDB");

        // バージョン 1 - 初期スキーマ
        // スキーマ変更時は必ず新バージョンでマイグレーションを定義する（TR-DB-003）
        this.version(1).stores({
            ingredients: "++id, name, unit, createdAt",
            shoppingItems: "++id, recipeId, checked, createdAt",
            cookingLogs: "++id, recipeId, cookedAt, monthKey",
            settings: "key",
        });
    }
}

/** DB インスタンス（シングルトン） */
export const db = new SoloRecipeDB();
