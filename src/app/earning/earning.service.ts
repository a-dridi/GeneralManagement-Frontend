import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class EarningService {

  fullApiurlTable: string;
  uriTable: string = "budgeting/data/earning";
  public uriAttachment: string = "/Earning";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllEarningTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getEarningsOfCertainYearTable(year) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/certainYear/${year}/${this.userId}`);
  }

  getEarningsOfCertainMonthYearTable(month, year) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/certainMonthYear/${month}/${year}/${this.userId}`);
  }

  getEarningById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveEarning(title, earningCategory, centValue, earningTimerange, earningDate, information, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const newEarning = {
      title: title,
      earningCategory: earningCategory,
      centValue: centValue,
      earningTimerange: earningTimerange,
      earningDate: earningDate,
      information: information,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newEarning);
  }

  updateEarning(earningId, title, earningCategory, centValue, earningTimerange, earningDate, information, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedEarning = {
      earningId: earningId,
      title: title,
      earningCategory: earningCategory,
      centValue: centValue,
      earningTimerange: earningTimerange,
      earningDate: earningDate,
      information: information,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedEarning);
  }

  updateEarningTable(earningId, title, earningCategory, centValue, earningTimerange, earningDate, information, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedEarning = {
      earningId: earningId,
      title: title,
      earningCategory: earningCategory,
      centValue: centValue,
      earningTimerange: earningTimerange,
      earningDate: earningDate,
      information: information,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedEarning);
  }

  deleteEarning(earningId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${earningId}`);
  }

  getMonthlyEarningsSum() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/sum/monthly/${this.userId}`);
  }

  getYearlyEarningsSum() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/sum/yearly/${this.userId}`);
  }

  getOfCertainMonthSingleAndCustomEarningsSum(month) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/sum/single/custom/certainMonth/${month}/${this.userId}`);
  }

  getEarningsSumOfCurrentMonth() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/sum/currentMonth/${this.userId}`);
  }

  restoreDeletedEarning(earningId) {
    return this.httpClient.get(`${this.fullApiurlTable}/restore/${earningId}`);
  }

  addEarningAttachment(id, extension, file) {
    return this.httpClient.put(`${this.apiConfig.baseAttachmentUrl}${this.uriAttachment}/${id}.${extension}`, file, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Authorization": "Basic " + btoa(this.apiConfig.webDavUsername + ":" + this.apiConfig.webDavPassword) }) });
  }

  updateEarningCategoriesOfEarnings(oldEarningCategoryId, newEarningCategoryId) {
    return this.httpClient.get(`${this.fullApiurlTable}/updateEarningCategories/${oldEarningCategoryId}/${newEarningCategoryId}/${this.userId}`);
  }

}
