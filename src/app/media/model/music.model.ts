import { MusicGenre } from "./music-genre.model";

export class Music {
    musicId: number;
    interpreter: string;
    songtitle: string;
    yearDate: number;
    musicGenre: MusicGenre;
    codeValue: string;
    linkValue: string;
    notice: string;
}