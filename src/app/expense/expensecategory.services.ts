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
    uriTable: string = "budgeting/data/expensecategory";
    userId: number;

    constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
        this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    }

    loadUserId() {
        this.userId = this.userAuthentication.getUserAuthenticationUserId();
    }

    getAllExpenseCategory() {
        this.loadUserId();
        return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
    }

    getExpenseCategoryById(id) {
        return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
    }

    getExpenseCategoryByTitle(title) {
        this.loadUserId();
        return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}/${this.userId}`);
    }

    saveExpenseCategory(title) {
        this.loadUserId();
        const newCategory = {
            categoryTitle: title, 
            userId: this.userId
        }
        return this.httpClient.post(`${this.fullApiurlTable}/add`, newCategory);
    }

    updateExpenseCategory(earningCategoryId, title) {
        const updatedExpenseCategory = {
            earningCategoryId: earningCategoryId,
            title: title
        };

        return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedExpenseCategory);
    }

    deleteExpenseCategoryById(expenseCategoryId) {
        return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${expenseCategoryId}`);
    }

    deleteExpenseCategoryByTitle(title) {
        this.loadUserId();
        return this.httpClient.delete(`${this.fullApiurlTable}/delete/byTitle/${title}/${this.userId}`);
    }

}
