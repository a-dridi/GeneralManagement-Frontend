import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  fullApiurlTable: string;
  uriTable: string = "common/data/book";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
    if (this.userId == 0) {
      // this.router.navigate([`/login`]);
    }
  }

  getAllBookTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getBookById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveBook(title, bookCategory, location, bookAvailability, language, year, isbn, information, addedDate) {
    this.loadUserId();
    const newBook = {
      title: title,
      bookCategory: bookCategory,
      location: location,
      bookAvailability: bookAvailability,
      bookLanguage: language,
      yearDate: year,
      isbn: isbn,
      information: information,
      addedDate: addedDate,
      deleted: false,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newBook);
  }

  updateBook(bookId, title, bookCategory, location, bookAvailability, language, year, isbn, information, addedDate) {
    this.loadUserId();
    const updatedBook = {
      bookId: bookId,
      title: title,
      bookCategory: bookCategory,
      location: location,
      bookAvailability: bookAvailability,
      bookLanguage: language,
      yearDate: year,
      isbn: isbn,
      information: information,
      addedDate: addedDate,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedBook);
  }

  updateBookTable(bookId, title, bookCategory, location, bookAvailability, language, year, isbn, information, addedDate) {
    this.loadUserId();
    const updatedBook = {
      bookId: bookId,
      title: title,
      bookCategory: bookCategory,
      location: location,
      bookAvailability: bookAvailability,
      bookLanguage: language,
      yearDate: year,
      isbn: isbn,
      information: information,
      addedDate: addedDate,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedBook);
  }

  deleteBook(bookId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${bookId}`);
  }

  restoreDeletedBook(bookId) {
    return this.httpClient.get(`${this.fullApiurlTable}/restore/${bookId}`);
  }

  updateBookCategoriesOfBooks(oldBookCategoryId, newBookCategoryId) {
    return this.httpClient.get(`${this.fullApiurlTable}/updateBookCategories/${oldBookCategoryId}/${newBookCategoryId}/${this.userId}`);
  }

}
