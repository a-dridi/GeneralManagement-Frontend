import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  fullApiurlTable: string;
  uriTable: string = "media/data/video";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllVideoTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getVideoById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveVideo(title, isOwnProduction, videoLanguage, isHd, videoGenre, durationLength, yearDate, isSeries, nativeTitle, linkValue) {
    this.loadUserId();
    const newVideo = {
      title: title,
      isOwnProduction: isOwnProduction,
      videoLanguage: videoLanguage,
      isHd: isHd,
      videoGenre: videoGenre,
      durationLength: durationLength,
      yearDate: yearDate,
      isSeries: isSeries,
      nativeTitle: nativeTitle,
      linkValue: linkValue,
      deleted: false,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newVideo);
  }

  updateVideo(videoId, title, isOwnProduction, videoLanguage, isHd, videoGenre, durationLength, yearDate, isSeries, nativeTitle, linkValue) {
    this.loadUserId();
    const updatedVideo = {
      videoId: videoId,
      title: title,
      isOwnProduction: isOwnProduction,
      videoLanguage: videoLanguage,
      isHd: isHd,
      videoGenre: videoGenre,
      durationLength: durationLength,
      yearDate: yearDate,
      isSeries: isSeries,
      nativeTitle: nativeTitle,
      linkValue: linkValue,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedVideo);
  }

  updateVideoTable(videoId, title, isOwnProduction, videoLanguage, isHd, videoGenre, durationLength, yearDate, isSeries, nativeTitle, linkValue) {
    this.loadUserId();
    const updatedVideo = {
      videoId: videoId,
      title: title,
      isOwnProduction: isOwnProduction,
      videoLanguage: videoLanguage,
      isHd: isHd,
      videoGenre: videoGenre,
      durationLength: durationLength,
      yearDate: yearDate,
      isSeries: isSeries,
      nativeTitle: nativeTitle,
      linkValue: linkValue,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedVideo);
  }

  deleteVideo(videoId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${videoId}`);
  }

  restoreDeletedVideo(videoId) {
    return this.httpClient.get(`${this.fullApiurlTable}/restore/${videoId}`);
  }

  updateVideoLanguagesOfVideos(oldVideoLanguageId, newVideoLanguageId) {
    return this.httpClient.get(`${this.fullApiurlTable}/updateVideoLanguages/${oldVideoLanguageId}/${newVideoLanguageId}/${this.userId}`);
  }

  updateVideoGenresOfVideos(oldVideoGenreId, newVideoGenreId) {
    return this.httpClient.get(`${this.fullApiurlTable}/updateVideoGenres/${oldVideoGenreId}/${newVideoGenreId}/${this.userId}`);
  }

}
