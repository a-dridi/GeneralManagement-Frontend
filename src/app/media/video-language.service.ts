import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class VideoLanguageService {

  fullApiurlTable: string;
  uriTable: string = "media/data/videolanguage";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllVideoLanguage() {
    return this.httpClient.get(`${this.fullApiurlTable}/all`);
  }

  getVideoLanguageById(id) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getVideoLanguageByTitle(title) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
  }

  saveVideoLanguage(title) {
    return this.httpClient.post(`${this.fullApiurlTable}/add`, title);
  }

  updateVideoLanguage(videolanguageId, languageTitle) {
    const updatedVideoLanguage = {
      videolanguageId: videolanguageId,
      languageTitle: languageTitle
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update/${videolanguageId}`, updatedVideoLanguage);
  }

  deleteVideoLanguageById(videolanguageId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${videolanguageId}`);
  }

  deleteVideoLanguageByTitle(title) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}`);
  }

}
