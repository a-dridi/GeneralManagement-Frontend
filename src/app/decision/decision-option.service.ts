import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class DecisionOptionService {

  fullApiurlTable: string;
  uriTable: string = "common/data/decisionoption";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllDecisionOptionTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getAllDecisionOptionByDecision(decisionId) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/ByDecision/${decisionId}/${this.userId}`);
  }

  getDecisionOptionById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveDecisionOption(title, decision) {
    this.loadUserId();
    const newDecisionOption = {
      title: title,
      decision: decision,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newDecisionOption);
  }

  updateDecisionOption(decisionoptionId, title, decision) {
    this.loadUserId();
    const updatedDecisionOption = {
      decisionoptionId: decisionoptionId,
      title: title,
      decision: decision,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedDecisionOption);
  }

  deleteDecisionOption(decisionoptionId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${decisionoptionId}`);
  }

}
