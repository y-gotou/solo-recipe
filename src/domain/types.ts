/**
 * ドメイン型定義
 * TR-STACK-006, technical-requirements.md §7.1 に対応
 */

/** 食材単位 */
export type Unit =
    | "g"
    | "ml"
    | "piece"
    | "大さじ"
    | "小さじ"
    | "本"
    | "枚"
    | "袋"
    | "缶";

/** レシピの食事種別（夕食固定 - TR-REC-001） */
export type MealType = "dinner";

/** レシピの食材 */
export interface RecipeIngredient {
    name: string;
    quantity: number;
    unit: Unit;
}

/** レシピデータ（src/data/recipes.json の1件） */
export interface Recipe {
    id: string;
    name: string;
    mealType: MealType;
    /** 調理時間（分） */
    cookingTimeMin: number;
    /** 推定コスト（円） */
    estimatedCost: number;
    ingredients: RecipeIngredient[];
    steps: string[];
}

/** レシピソース仕様 - TR-REC-002 */
export type RecipeSource = {
    path: "src/data/recipes.json";
    minRecipeCount: 50;
    validation: "zod";
};
