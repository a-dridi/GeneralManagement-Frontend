import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
    providedIn: 'root'
})
export class ExpenseGraphService {

    fullApiurlTable: string;
    uriTable: string = "budgeting/data/expensegraph";
    userId: number;

    constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
        this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
        this.userId = this.userAuthentication.getUserAuthenticationUserId();
        if (this.userId == 0) {
            this.router.navigate([`/login`]);
        }
    }

    getAllMonthlyExpensesSum() {
        return this.httpClient.get(`${this.fullApiurlTable}/expensesSum/monthly/${this.userId}`);
    }

    getAllYearlyExpensesSum() {
        return this.httpClient.get(`${this.fullApiurlTable}/expensesSum/yearly/${this.userId}`);
    }

    getAllCurrentYearExpensesSum() {
        return this.httpClient.get(`${this.fullApiurlTable}/expensesSum/currentYear/${this.userId}`);
    }

}
