import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
    providedIn: 'root'
})
export class ExpenseTimerangeService {

    fullApiurlTable: string;
    uriTable: string = "data/expensetimerange";
    userId: number;

    constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
        this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
        this.userId = this.userAuthentication.getUserAuthenticationUserId();
        if (this.userId == 0) {
            this.router.navigate([`/login`]);
        }
    }

    getAllExpenseTimerange() {
        return this.httpClient.get(`${this.fullApiurlTable}/all`);
    }

    getExpenseTimerangeById(id) {
        return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
    }

    getExpenseTimerangeByTitle(title) {
        return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
    }

    saveExpenseTimerange(title) {
        const newExpenseTimerange = {
            title: title
        };
        return this.httpClient.post(`${this.fullApiurlTable}/add`, newExpenseTimerange);
    }

    updateExpenseTimerange(id, title) {
        const updatedExpenseTimerange = {
            timerangeId: id,
            timerangeTitle: title
        };
        return this.httpClient.post(`${this.fullApiurlTable}/update/${id}`, updatedExpenseTimerange);
    }

    deleteExpenseTimerangeById(expenseTimerangeId) {
        return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${expenseTimerangeId}`);
    }

    deleteExpenseTimerangeByTitle(title) {
        return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}`);
    }

}
