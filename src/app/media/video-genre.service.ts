import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class VideoGenreService {

  fullApiurlTable: string;
  uriTable: string = "media/data/videogenre";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllVideoGenre() {
    return this.httpClient.get(`${this.fullApiurlTable}/all`);
  }

  getVideoGenreById(id) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getVideoGenreByTitle(title) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
  }

  saveVideoGenre(title) {
    return this.httpClient.post(`${this.fullApiurlTable}/add`, title);
  }

  updateVideoGenre(videogenreId, genreTitle) {
    const updatedVideoGenre = {
      videogenreId: videogenreId,
      genreTitle: genreTitle
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update/${videogenreId}`, updatedVideoGenre);
  }

  deleteVideoGenreById(videogenreId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${videogenreId}`);
  }

  deleteVideoGenreByTitle(title) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}`);
  }

}
