import { VideoGenre } from "./video-genre.model";
import { VideoLanguage } from "./video-language.model";

export class Video {
    videoId: number;
    title: string;
    isOwnProduction: boolean;
    videoLanguage: VideoLanguage;
    isHd: boolean;
    videoGenre: VideoGenre;
    durationLength: number;
    yearDate: number;
    isSeries: boolean;
    nativeTitle: string;
    linkValue: string;
}