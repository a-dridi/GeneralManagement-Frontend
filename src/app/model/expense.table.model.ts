export interface ExpenseTable {
    expenseId: number;
    title: string;
    centValue: number;
    expenseCategory: string;
    expenseTimerange: string;
    paymentDate: Date;
    information: String;
    attachment: boolean;
    attachmentPath: string;
    attachmentName: string;
    attachmentType: string;
}