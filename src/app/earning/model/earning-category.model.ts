export class EarningCategory {
    earningCategoryId: number;
    categoryTitle: string;

    public toString = (): string => {
        return this.categoryTitle;
    }
}