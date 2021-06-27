import { ExpenseCategory } from "./expense-category.model";

export class ExpenseBudget {
    expensesbudgetId: number;
    expenseCategory: ExpenseCategory;
    centBudgetValue: number;
    centActualExpenses: number;
    centDifference: number;
    s: string;
    notice: string;
}