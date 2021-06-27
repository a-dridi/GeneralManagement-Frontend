import { SoftwareOs } from "./software-os.model";

export class Software {
    softwareId: number;
    title: string;
    softwareOs: SoftwareOs;
    manufacturer: string;
    language: string;
    version: string;
    notice: string;
    linkValue: string;
    attachment: boolean;
    attachmentPath: string;
    attachmentName: string;
    attachmentType: string;
}