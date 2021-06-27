import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class OrganizationCategoryService {

  fullApiurlTable: string;
  uriTable: string = "common/data/organizationcategory";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
    if (this.userId == 0) {
      this.router.navigate([`/login`]);
    }
  }

  getAllOrganizationCategory() {
    return this.httpClient.get(`${this.fullApiurlTable}/all`);
  }

  getOrganizationCategoryById(id) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getOrganizationCategoryByTitle(title) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
  }

  saveOrganizationCategory(title) {
    return this.httpClient.post(`${this.fullApiurlTable}/add`, title);
  }

  updateOrganizationCategory(organizationcategoryId, title) {
    const updatedOrganizationCategory = {
      organizationcategoryId: organizationcategoryId,
      title: title
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedOrganizationCategory);
  }

  deleteOrganizationCategoryById(organizationCategoryId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${organizationCategoryId}`);
  }

  deleteOrganizationCategoryByTitle(title) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}`);
  }
}
