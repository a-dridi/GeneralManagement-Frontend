import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class DecisionService {

  fullApiurlTable: string;
  uriTable: string = "common/data/decision";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
    if (this.userId == 0) {
      // this.router.navigate([`/login`]);
    }
  }

  getAllDecisionTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getDecisionById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveDecision(title, chosenOption, chosenOptionId, information, addedDate) {
    this.loadUserId();
    const newDecision = {
      title: title,
      chosenOption: chosenOption,
      chosenOptionId: chosenOptionId,
      information: information,
      addedDate: addedDate,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newDecision);
  }

  updateDecision(decisionId, title, chosenOption, chosenOptionId, information, addedDate) {
    this.loadUserId();
    const updatedDecision = {
      decisionId: decisionId,
      title: title,
      chosenOption: chosenOption,
      chosenOptionId: chosenOptionId,
      information: information,
      addedDate: addedDate,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedDecision);
  }

  updateDecisionTable(decisionId, title, chosenOption, chosenOptionId, information) {
    this.loadUserId();
    const updatedDecision = {
      decisionId: decisionId,
      title: title,
      chosenOption: chosenOption,
      chosenOptionId: chosenOptionId,
      information: information,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedDecision);
  }

  deleteDecision(decisionId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${decisionId}`);
  }

  setChosenDecisionOption(chosenOption, chosenOptionId, decisionId) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/setChosenOption/${chosenOptionId}/${chosenOption}/${decisionId}/${this.userId}`);
  }

}
