import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class EarningDevelopmentService {

  fullApiurlTable: string;
  uriTable: string = "budgeting/data/earningdevelopment";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
      this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
      this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getLatestMonthlyEarningDevelopmentList() {
      return this.httpClient.get(`${this.fullApiurlTable}/last/24/months/${this.userId}`);
  }

  getLatestYearlyEarningDevelopmentList() {
      return this.httpClient.get(`${this.fullApiurlTable}/last/15/years/${this.userId}`);
  }

}
