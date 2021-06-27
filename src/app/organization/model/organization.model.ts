import { OrganizationCategory } from "./organization-category.model";

export class Organization {
    organizationId: number;
    description: string;
    organizationCategory: OrganizationCategory;
    location: string;
    status: string;
    information: String;
    attachment: boolean;
    attachmentPath: string;
    attachmentName: string;
    attachmentType: string;
}