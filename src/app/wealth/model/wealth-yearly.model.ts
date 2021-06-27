export interface WealthYearly {
    wealthyearlyId: number;
    yearDate: number;
    expenseCent: number;
    earningCent: number;
    differenceCent: number;
    improvementPct: number;
    notice: String;
    attachment: boolean;
    attachmentPath: string;
    attachmentName: string;
    attachmentType: string;
}