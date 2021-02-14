import { ExpenseCategory } from './expense-category.model';
import { ExpenseTimerange } from './expense-timerange.model';

export interface Expense {
    expenseId: number;
    title: string;
    centValue: number;
    expenseCategory: ExpenseCategory;
    expenseTimerange: ExpenseTimerange;
    paymentDate: Date;
    information: String;
    attachment: boolean;
    attachmentPath: string;
    attachmentName: string;
    attachmentType: string;
    deleted: boolean;
    userId: number;
}