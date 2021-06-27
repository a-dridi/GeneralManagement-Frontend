export class ExpenseCategory {
    expenseCategoryId: number;
    categoryTitle: string;

    public toString = (): string => {
        return this.categoryTitle;
    }
}