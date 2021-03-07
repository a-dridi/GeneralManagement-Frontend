import { NumberSymbol } from "@angular/common";

export class ExpenseCategory {
    expenseCategoryId: NumberSymbol;
    categoryTitle: string;

    public toString = (): string => {
        return this.categoryTitle;
    }
}