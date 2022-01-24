import { ExpenseCategory } from './expense-category.model';
import { ExpenseReminder } from './expense-reminder.model';
import { ExpenseTimerange } from './expense-timerange.model';

export class Expense {
    expenseId: number;
    title: string;
    centValue: number;
    expenseCategory: ExpenseCategory;
    expenseTimerange: ExpenseTimerange;
    paymentDate: Date;
    information: String;
    isReminding: boolean;
    attachment: boolean;
    attachmentPath: string;
    attachmentName: string;
    attachmentType: string;
    deleted: boolean;
    userId: number;
}