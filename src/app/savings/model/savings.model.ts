export class Savings {
    savingsId: number;
    description: string;
    targetCent: number;
    stepAmountCent: number;
    savingsFrequency: number;
    savedTillNowCent: number;
    lastSavingsUpdateDate: Date;
    startDate: Date;
    targetCalculatedDate: Date;
    notice: String;
    attachment: boolean;
    attachmentPath: string;
    attachmentName: string;
    attachmentType: string;
}