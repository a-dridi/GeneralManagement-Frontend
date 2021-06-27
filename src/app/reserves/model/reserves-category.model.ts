export class ReservesCategory {
    reservesCategoryId: number;
    categoryTitle: string;

    public toString = (): string => {
        return this.categoryTitle;
    }
}