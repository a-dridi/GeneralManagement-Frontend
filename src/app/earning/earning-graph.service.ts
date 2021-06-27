import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class EarningGraphService {

  fullApiurlTable: string;
  uriTable: string = "budgeting/data/earninggraph";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
      this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
      this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllMonthlyEarningsSum() {
      return this.httpClient.get(`${this.fullApiurlTable}/earningsSum/monthly/${this.userId}`);
  }

  getAllYearlyEarningsSum() {
      return this.httpClient.get(`${this.fullApiurlTable}/earningsSum/yearly/${this.userId}`);
  }

  getAllCurrentYearEarningsSum() {
      return this.httpClient.get(`${this.fullApiurlTable}/earningsSum/currentYear/${this.userId}`);
  }

}
