import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class ExpenseDevelopmentService {

  fullApiurlTable: string;
  uriTable: string = "budgeting/data/expensedevelopment";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
      this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
      this.userId = this.userAuthentication.getUserAuthenticationUserId();
      if (this.userId == 0) {
          this.router.navigate([`/login`]);
      }
  }

  getLatestMonthlyExpenseDevelopmentList() {
      return this.httpClient.get(`${this.fullApiurlTable}/last/24/${this.userId}`);
  }

  getLatestYearlyExpenseDevelopmentList() {
      return this.httpClient.get(`${this.fullApiurlTable}/last/15/years/${this.userId}`);
  }

}
