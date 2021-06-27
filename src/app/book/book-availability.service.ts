import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class BookAvailabilityService {

  fullApiurlTable: string;
  uriTable: string = "common/data/bookavailability";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllBookAvailability() {
    return this.httpClient.get(`${this.fullApiurlTable}/all`);
  }

  getBookAvailabilityById(id) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getBookAvailabilityByTitle(title) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
  }

  saveBookAvailability(title) {
    return this.httpClient.post(`${this.fullApiurlTable}/add`, title);
  }

  updateBookAvailability(bookAvailibilityId, availabilityTitle) {
    const updatedBookAvailability = {
      bookAvailibilityId: bookAvailibilityId,
      availabilityTitle: availabilityTitle
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update/${bookAvailibilityId}`, updatedBookAvailability);
  }

  deleteBookAvailabilityById(bookAvailibilityId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${bookAvailibilityId}`);
  }

  deleteBookAvailabilityByTitle(title) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}`);
  }
}
