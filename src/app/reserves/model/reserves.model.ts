import {ReservesCategory} from './reserves-category.model';

export class Reserves {
    reservesId: number;
    category: ReservesCategory;
    description: string;
    amount: number;
    currency: string;
    storageLocation: string;
    notice: String;
    createdDate: Date;
    attachment: boolean;
    attachmentPath: string;
    attachmentName: string;
    attachmentType: string;
}