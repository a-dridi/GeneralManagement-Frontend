import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class BookCategoryService {

  fullApiurlTable: string;
  uriTable: string = "common/data/bookcategory";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllBookCategory() {
    return this.httpClient.get(`${this.fullApiurlTable}/all`);
  }

  getBookCategoryById(id) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getBookCategoryByTitle(title) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
  }

  saveBookCategory(title) {
    return this.httpClient.post(`${this.fullApiurlTable}/add`, title);
  }

  updateBookCategory(bookCategoryId, categoryTitle) {
    const updatedBookCategory = {
      bookCategoryId: bookCategoryId,
      categoryTitle: categoryTitle
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update/${bookCategoryId}`, updatedBookCategory);
  }

  deleteBookCategoryById(bookCategoryId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${bookCategoryId}`);
  }

  deleteBookCategoryByTitle(title) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}`);
  }
  
}
