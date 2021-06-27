import { BookAvailability } from "./book-availability.model";
import { BookCategory } from "./book-category.model";

export class Book {
    bookId: number;
    title: string;
    bookCategory: BookCategory;
    location: string;
    bookAvailability: BookAvailability;
    bookLanguage: string;
    yearDate: string;
    isbn: string;
    information: String;
    addedDate: Date;
}