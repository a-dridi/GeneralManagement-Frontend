import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class MusicGenreService {

  fullApiurlTable: string;
  uriTable: string = "media/data/musicgenre";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllMusicGenre() {
    return this.httpClient.get(`${this.fullApiurlTable}/all`);
  }

  getMusicGenreById(id) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getMusicGenreByTitle(title) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
  }

  saveMusicGenre(title) {
    return this.httpClient.post(`${this.fullApiurlTable}/add`, title);
  }

  updateMusicGenre(musicgenreId, genreTitle) {
    const updatedMusicGenre = {
      musicgenreId: musicgenreId,
      genreTitle: genreTitle
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update/${musicgenreId}`, updatedMusicGenre);
  }

  deleteMusicGenreById(musicgenreId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${musicgenreId}`);
  }

}
