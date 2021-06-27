import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class ReservesCategoryService {

  fullApiurlTable: string;
  uriTable: string = "financial/data/reservescategory";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllReservesCategory() {
    return this.httpClient.get(`${this.fullApiurlTable}/all`);
  }

  getReservesCategoryById(id) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getReservesCategoryByTitle(title) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
  }

  saveReservesCategory(title) {
    return this.httpClient.post(`${this.fullApiurlTable}/add`, title);
  }

  updateReservesCategory(reservesCategoryId, title) {
    const updatedReservesCategory = {
      reservesCategoryId: reservesCategoryId,
      title: title
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update/`, updatedReservesCategory);
  }

  deleteReservesCategoryById(earningCategoryId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${earningCategoryId}`);
  }

  deleteReservesCategoryByTitle(title) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}`);
  }

}
