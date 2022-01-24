import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class ExpenseReminderService {
  fullApiurlTable: string;
  uriTable: string = "budgeting/data/expensereminder";

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  getExpenseReminderByExpenseId(expenseId) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byExpenseId/${expenseId}`);
  }

  saveExpenseReminder(expenseId, dueDate) {
    const newExpenseReminder = {
      expenseId: expenseId,
      dueDate: dueDate,
      payedDate: null
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newExpenseReminder);
  }

  updateExpenseReminderTable(expensereminderId, expenseId, dueDate, payedDate) {
    const updatedExpenseReminder = {
      expensereminderId: expensereminderId,
      expenseId: expenseId,
      dueDate: dueDate,
      payedDate: payedDate
    };
    return this.httpClient.post(`${this.fullApiurlTable}/payExpense`, updatedExpenseReminder);
  }

  deleteExpenseReminderByExpenseId(expenseId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byExpenseId/${expenseId}`);
  }

}
