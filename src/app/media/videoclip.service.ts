import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class VideoclipService {

  fullApiurlTable: string;
  uriTable: string = "media/data/videoclip";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllVideoclipTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getVideoclipById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveVideoclip(interpreter, videoTitle, videoclipLanguage, yearDate, nativeTitle, linkValue) {
    this.loadUserId();
    const newVideoclip = {
      interpreter: interpreter,
      videoTitle: videoTitle,
      videoclipLanguage: videoclipLanguage,
      yearDate: yearDate,
      nativeTitle: nativeTitle,
      linkValue: linkValue,
      deleted: false,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newVideoclip);
  }

  updateVideoclip(videoclipId, interpreter, videoTitle, videoclipLanguage, yearDate, nativeTitle, linkValue) {
    this.loadUserId();
    const updatedVideoclip = {
      videoclipId: videoclipId,
      interpreter: interpreter,
      videoTitle: videoTitle,
      videoclipLanguage: videoclipLanguage,
      yearDate: yearDate,
      nativeTitle: nativeTitle,
      linkValue: linkValue,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedVideoclip);
  }

  updateVideoclipTable(videoclipId, interpreter, videoTitle, videoclipLanguage, yearDate, nativeTitle, linkValue) {
    this.loadUserId();
    const updatedVideoclip = {
      videoclipId: videoclipId,
      interpreter: interpreter,
      videoTitle: videoTitle,
      videoclipLanguage: videoclipLanguage,
      yearDate: yearDate,
      nativeTitle: nativeTitle,
      linkValue: linkValue,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedVideoclip);
  }

  deleteVideoclip(videoclipId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${videoclipId}`);
  }

  restoreDeletedVideoclip(videoclipId) {
    return this.httpClient.get(`${this.fullApiurlTable}/restore/${videoclipId}`);
  }

  updateVideoclipLanguagesOfVideoclips(oldVideoclipLanguageId, newVideoclipLanguageId) {
    return this.httpClient.get(`${this.fullApiurlTable}/updateVideoclipLanguages/${oldVideoclipLanguageId}/${newVideoclipLanguageId}/${this.userId}`);
  }

}
