import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class CriteriaOptionService {

  fullApiurlTable: string;
  uriTable: string = "common/data/criteriaoption";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllCriteriaOptionTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getAllCriteriaOptionOfDecision(decisionId) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/ofDecision/${decisionId}/${this.userId}`);
  }

  getCriteriaOptionById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveCriteriaOption(criteriaTitle, criteriaWeighting, decision) {
    this.loadUserId();
    const newCriteriaOption = {
      criteriaTitle: criteriaTitle,
      criteriaWeighting: criteriaWeighting,
      decision: decision,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newCriteriaOption);
  }

  updateCriteriaOption(criteriaoptionId, criteriaTitle, criteriaWeighting, decision) {
    this.loadUserId();
    const updatedCriteriaOption = {
      criteriaoptionId: criteriaoptionId,
      criteriaTitle: criteriaTitle,
      criteriaWeighting: criteriaWeighting,
      decision: decision,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedCriteriaOption);
  }

  deleteCriteriaOption(criteriaoptionId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${criteriaoptionId}`);
  }

}
