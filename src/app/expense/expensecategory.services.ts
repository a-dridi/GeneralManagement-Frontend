import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
    providedIn: 'root'
})
export class ExpenseCategoryService {

    fullApiurlTable: string;
    uriTable: string = "data/expensecategory";
    userId: number;

    constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
        this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
        this.userId = this.userAuthentication.getUserAuthenticationUserId();
        if (this.userId == 0) {
            this.router.navigate([`/login`]);
        }
    }

    getAllExpenseCategory() {
        return this.httpClient.get(`${this.fullApiurlTable}/all`);
    }

    getExpenseCategoryById(id) {
        return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
    }

    getExpenseCategoryByTitle(title) {
        return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
    }

    saveExpenseCategory(title) {
        console.log("EXPENSE CATEGORY SAVE!!!");
        return this.httpClient.post(`${this.fullApiurlTable}/add`, title);
    }

    updateExpenseCategory(expenseId, title) {
        const updatedExpenseCategory = {
            expenseId: expenseId,
            title: title
        };

        return this.httpClient.post(`${this.fullApiurlTable}/update/${expenseId}`, updatedExpenseCategory);
    }

    deleteExpenseCategoryById(expenseCategoryId) {
        return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${expenseCategoryId}`);
    }

    deleteExpenseCategoryByTitle(title) {
        return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}`);
    }

}
