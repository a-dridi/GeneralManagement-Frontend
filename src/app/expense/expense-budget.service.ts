import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class ExpenseBudgetService {

  fullApiurlTable: string;
  uriTable: string = "data/expensebudget";
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

  getAllExpenseBudget() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getExpenseBudgetById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveExpenseBudget(expenseCategory, centBudgetValue, centActualExpenses, centDifference, s, notice) {
    this.loadUserId();
    const newExpenseBudget = {
      expenseCategory: expenseCategory,
      centBudgetValue: centBudgetValue,
      centActualExpenses: centActualExpenses,
      centDifference: centDifference,
      s: s,
      notice: notice,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newExpenseBudget);
  }

  updateExpenseBudget(expensesbudgetId, expenseCategory, centBudgetValue, centActualExpenses, centDifference, s, notice) {
    this.loadUserId();
    const newExpenseBudget = {
      expensesbudgetId: expensesbudgetId,
      expenseCategory: expenseCategory,
      centBudgetValue: centBudgetValue,
      centActualExpenses: centActualExpenses,
      centDifference: centDifference,
      s: s,
      notice: notice,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/update`, newExpenseBudget);
  }

  deleteExpenseBudget(expenseBudgetId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${expenseBudgetId}`);
  }

}
