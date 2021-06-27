import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class VideoGraphService {

  fullApiurlTable: string;
  uriTable: string = "media/data/videograph";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getVideoGenreAmountList() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/amountBy/video/genre/${this.userId}`);
  }

  getVideoLanguageAmountList() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/amountBy/video/language/${this.userId}`);
  }

  getVideoclipLanguageAmountList() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/amountBy/videoclip/language/${this.userId}`);
  }

}
