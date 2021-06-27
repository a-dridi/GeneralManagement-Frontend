import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  fullApiurlTable: string;
  uriTable: string = "media/data/music";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllMusicTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getMusicById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveMusic(interpreter, songtitle, yearDate, musicGenre, codeValue, linkValue, notice) {
    this.loadUserId();
    const newMusic = {
      interpreter: interpreter,
      songtitle: songtitle,
      yearDate: yearDate,
      musicGenre: musicGenre,
      codeValue: codeValue,
      linkValue: linkValue,
      notice: notice,
      deleted: false,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newMusic);
  }

  updateMusic(musicId, interpreter, songtitle, yearDate, musicGenre, codeValue, linkValue, notice) {
    this.loadUserId();
    const updatedMusic = {
      musicId: musicId,
      interpreter: interpreter,
      songtitle: songtitle,
      yearDate: yearDate,
      musicGenre: musicGenre,
      codeValue: codeValue,
      linkValue: linkValue,
      notice: notice,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedMusic);
  }

  updateMusicTable(musicId, interpreter, songtitle, yearDate, musicGenre, codeValue, linkValue, notice) {
    this.loadUserId();
    const updatedMusic = {
      musicId: musicId,
      interpreter: interpreter,
      songtitle: songtitle,
      yearDate: yearDate,
      musicGenre: musicGenre,
      codeValue: codeValue,
      linkValue: linkValue,
      notice: notice,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedMusic);
  }

  deleteMusic(musicId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${musicId}`);
  }

  restoreDeletedMusic(musicId) {
    return this.httpClient.get(`${this.fullApiurlTable}/restore/${musicId}`);
  }

  updateGenresOfMusic(oldMusicGenreId, newMusicGenreId) {
    return this.httpClient.get(`${this.fullApiurlTable}/updateMusicGenres/${oldMusicGenreId}/${newMusicGenreId}/${this.userId}`);
  }

}
