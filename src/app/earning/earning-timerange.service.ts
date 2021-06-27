import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class EarningTimerangeService {

  fullApiurlTable: string;
  uriTable: string = "budgeting/data/earningtimerange";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
      this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
      this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllEarningTimerange() {
      return this.httpClient.get(`${this.fullApiurlTable}/all`);
  }

  getEarningTimerangeById(id) {
      return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getEarningTimerangeByTitle(title) {
      return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
  }

  saveEarningTimerange(title) {
      const newEarningTimerange = {
          title: title
      };
      return this.httpClient.post(`${this.fullApiurlTable}/add`, newEarningTimerange);
  }

  updateEarningTimerange(id, title) {
      const updatedEarningTimerange = {
          timerangeId: id,
          timerangeTitle: title
      };
      return this.httpClient.post(`${this.fullApiurlTable}/update/${id}`, updatedEarningTimerange);
  }

  deleteEarningTimerangeById(earningTimerangeId) {
      return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${earningTimerangeId}`);
  }

  deleteEarningTimerangeByTitle(title) {
      return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}`);
  }
}
