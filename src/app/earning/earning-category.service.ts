import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class EarningCategoryService {

  fullApiurlTable: string;
  uriTable: string = "budgeting/data/earningcategory";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
      this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
      this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllEarningCategory() {
      return this.httpClient.get(`${this.fullApiurlTable}/all`);
  }

  getEarningCategoryById(id) {
      return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getEarningCategoryByTitle(title) {
      return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
  }

  saveEarningCategory(title) {
      return this.httpClient.post(`${this.fullApiurlTable}/add`, title);
  }

  updateEarningCategory(earningCategoryId, title) {
      const updatedEarningCategory = {
        earningCategoryId: earningCategoryId,
          title: title
      };

      return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedEarningCategory);
  }

  deleteEarningCategoryById(earningCategoryId) {
      return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${earningCategoryId}`);
  }

  deleteEarningCategoryByTitle(title) {
      return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}`);
  }
  
}
