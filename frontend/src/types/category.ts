export type CategoryType = "income" | "expense";

export interface Category {
  _id: string;
  name: string;
  type: CategoryType;
  isDefault?: boolean;
  userId?: string;
}

export interface CategorySummary {
  category: string;
  type: CategoryType;
  value: number;
}
