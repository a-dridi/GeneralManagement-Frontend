import { Expense } from "./expense.model";

export class ExpenseReminder {
    expensereminderId: number;
    expense: Expense;
    dueDate: Date;
    payedDate: Date;
}