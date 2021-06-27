import { VideoclipLanguage } from "./videoclip-language.model";

export class Videoclip {
    videoclipId: number;
    interpreter: string;
    videoTitle: string;
    videoclipLanguage: VideoclipLanguage;
    yearDate: number;
    nativeTitle: string;
    linkValue: string;
}