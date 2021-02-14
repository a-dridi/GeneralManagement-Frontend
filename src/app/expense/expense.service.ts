import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  fullApiurlTable: string;
  uriTable: string = "data/expense";
  public uriAttachment: string = "/Ausgaben";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
    console.log("USER ID: ");
    console.log(this.userId);
    if (this.userId == 0) {
      // this.router.navigate([`/login`]);
    }
    console.log("Authentication token: ");
    console.log(this.userAuthentication.getUserAuthenticationJwtToken());
  }

  getAllExpenseTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getExpensesOfCertainYearTable(year) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/certainYear/${year}/${this.userId}`);
  }

  getExpensesOfCertainMonthYearTable(month, year) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/certainMonthYear/${month}/${year}/${this.userId}`);
  }

  getExpenseById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveExpense(title, expenseCategory, centValue, expenseTimerange, paymentDate, information, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const newExpense = {
      title: title,
      expenseCategory: expenseCategory,
      centValue: centValue,
      expenseTimerange: expenseTimerange,
      paymentDate: paymentDate,
      information: information,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newExpense);
  }

  updateExpense(expenseId, title, expenseCategory, centValue, expenseTimerange, paymentDate, information, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedExpense = {
      expenseId: expenseId,
      title: title,
      expenseCategory: expenseCategory,
      centValue: centValue,
      expenseTimerange: expenseTimerange,
      paymentDate: paymentDate,
      information: information,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedExpense);
  }

  updateExpenseTable(expenseId, title, expenseCategory, centValue, expenseTimerange, paymentDate, information, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedExpense = {
      expenseId: expenseId,
      title: title,
      expenseCategory: expenseCategory,
      centValue: centValue,
      expenseTimerange: expenseTimerange,
      paymentDate: paymentDate,
      information: information,
      attachment: false,
      attachmentPath: "",
      attachmentName: "",
      attachmentType: "",
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedExpense);
  }

  deleteExpense(expenseId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${expenseId}`);
  }

  getMonthlyExpensesSum() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/sum/monthly/${this.userId}`);
  }

  getYearlyExpensesSum() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/sum/yearly/${this.userId}`);
  }

  getOfCertainMonthSingleAndCustomExpensesSum(month) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/sum/single/custom/certainMonth/${month}/${this.userId}`);
  }

  restoreDeletedExpense(expenseId) {
    return this.httpClient.get(`${this.fullApiurlTable}/restore/${expenseId}`);
  }

  addExpenseAttachment(id, extension, file) {
    return this.httpClient.put(`${this.apiConfig.baseAttachmentUrl}${this.uriAttachment}/${id}.${extension}`, file, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Authorization": "Basic " + btoa(this.apiConfig.webDavUsername+":"+this.apiConfig.webDavPassword) }) });
  }

  updateExpenseCategoriesOfExpenses(oldExpenseCategoryId, newExpenseCategoryId){
    return this.httpClient.get(`${this.fullApiurlTable}/updateExpenseCategories/${oldExpenseCategoryId}/${newExpenseCategoryId}/${this.userId}`);
  }

}
