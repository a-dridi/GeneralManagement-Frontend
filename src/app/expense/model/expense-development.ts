export class ExpenseDevelopment {
    expenseDevelopmentId: number;
    month: number;
    year: number;
    dateDisplay: string;
    centSum: number;
    userId: number;

    public toString = (): string => {
        return this.dateDisplay;
    }
}