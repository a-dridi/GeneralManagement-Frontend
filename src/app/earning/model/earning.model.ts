import { EarningCategory } from "./earning-category.model";
import { EarningTimerange } from "./earning-timerange.model";

export class Earning {
    earningId: number;
    title: string;
    centValue: number;
    earningCategory: EarningCategory;
    earningTimerange: EarningTimerange;
    earningDate: Date;
    information: String;
    attachment: boolean;
    attachmentPath: string;
    attachmentName: string;
    attachmentType: string;
    deleted: boolean;
    userId: number;
}