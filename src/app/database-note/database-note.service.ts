import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class DatabaseNoteService {

  fullApiurl: string;
  uri: string = "common/data/databasenote";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurl = this.apiConfig.apiUrl + "/" + this.uri;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllNote() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurl}/all/${this.userId}`);
  }

  getNoteByTablename(tableName) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurl}/get/byTable/byUserId/${tableName}/${this.userId}`);
  }

  saveNote(table, noteText, date) {
    this.loadUserId();
    const newDatabaseNote = {
      appTable: table,
      noteText: noteText,
      date: date,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurl}/add`, newDatabaseNote);
  }

  updateDatabaseNote(id, table, noteText, date) {
    this.loadUserId();
    const updatedDatabaseNote = {
      id: id,
      appTable: table,
      noteText: noteText,
      date: date,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurl}/update`, updatedDatabaseNote);
  }

  deleteDatabaseNote(id) {
    return this.httpClient.delete(`${this.fullApiurl}/delete/${id}`);
  }
}
