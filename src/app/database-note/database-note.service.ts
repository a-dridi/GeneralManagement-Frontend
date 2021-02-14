import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';

@Injectable({
  providedIn: 'root'
})
export class DatabaseNoteService {

  fullApiurl: string;
  uri: string = "/data/databasenote";

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig) {
    this.fullApiurl = this.apiConfig.apiUrl + "/" + this.uri;
  }

  getAllNote(userId) {
    return this.httpClient.get(`${this.fullApiurl}/all/${userId}`);
  }

  getNoteByTablename(tableName, userId) {
    return this.httpClient.get(`${this.fullApiurl}/get/byTable/byUserId/${tableName}/${userId}`);
  }

  saveNote(table, noteText, date, userId) {
    const newDatabaseNote = {
      table: table,
      noteText: noteText,
      date: date,
      userId: userId
    };
    return this.httpClient.post(`${this.fullApiurl}/add`, newDatabaseNote);
  }

  updateDatabaseNote(id, table, noteText, date, userId) {
    const updatedDatabaseNote = {
      id: id,
      table: table,
      noteText: noteText,
      date: date,
      userId: userId
    };
    return this.httpClient.put(`${this.fullApiurl}/update`, updatedDatabaseNote);
  }

  deleteDatabaseNote(id) {
    return this.httpClient.delete(`${this.fullApiurl}/delete/${id}`);
  }
}
