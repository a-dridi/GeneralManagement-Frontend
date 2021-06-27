import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class VideoclipLanguageService {

  fullApiurlTable: string;
  uriTable: string = "media/data/videocliplanguage";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllVideoclipLanguage() {
    return this.httpClient.get(`${this.fullApiurlTable}/all`);
  }

  getVideoclipLanguageById(id) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getVideoclipLanguageByTitle(title) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
  }

  saveVideoclipLanguage(title) {
    return this.httpClient.post(`${this.fullApiurlTable}/add`, title);
  }

  updateVideoclipLanguage(videocliplanguageId, languageTitle) {
    const updatedVideoclipLanguage = {
      videocliplanguageId: videocliplanguageId,
      languageTitle: languageTitle
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update/${videocliplanguageId}`, updatedVideoclipLanguage);
  }

  deleteVideoclipLanguageById(videocliplanguageId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${videocliplanguageId}`);
  }

  deleteVideoclipLanguageByTitle(title) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}`);
  }

}
