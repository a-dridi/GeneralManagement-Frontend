import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class BookGraphService {

  fullApiurlTable: string;
  uriTable: string = "common/data/bookgraph";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getBookCategoryAmountList() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/amountBy/category/${this.userId}`);
  }

  getBookLanguageAmountList() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/amountBy/language/${this.userId}`);
  }

}
