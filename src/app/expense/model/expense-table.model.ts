import { ExpenseReminder } from "./expense-reminder.model";

export class ExpenseTable {
    expenseId: number;
    title: string;
    centValue: number;
    expenseCategory: string;
    expenseTimerange: string;
    paymentDate: Date;
    information: String;
    isReminding: boolean;
    attachment: boolean;
    attachmentPath: string;
    attachmentName: string;
    attachmentType: string;
}