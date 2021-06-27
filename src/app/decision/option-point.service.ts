import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class OptionPointService {

  fullApiurlTable: string;
  uriTable: string = "common/data/optionpoint";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllOptionPointTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getAllOptionPointByCriteriaId(criteriaId) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byCriteriaId/${criteriaId}/${this.userId}`);
  }

  getOptionPointById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getPointsSumOfDecisionOption(decisionOptionId) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/pointsSum/ofDecisionOption/${decisionOptionId}/${this.userId}`);
  }

  saveOptionPoint(decisionOptionId, criteriaId, decisionId, points, total) {
    this.loadUserId();
    const newOptionPoint = {
      decisionOptionId: decisionOptionId,
      criteriaId: criteriaId,
      decisionId: decisionId,
      points: points,
      total: total,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newOptionPoint);
  }

  updateOptionPoint(optionpointId, decisionOptionId, criteriaId, decisionId, points, total) {
    this.loadUserId();
    const updatedOptionPoint = {
      optionpointId: optionpointId,
      decisionOptionId: decisionOptionId,
      criteriaId: criteriaId,
      decisionId: decisionId,
      points: points,
      total: total,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedOptionPoint);
  }

  deleteOptionPoint(optionpointId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${optionpointId}`);
  }

}
