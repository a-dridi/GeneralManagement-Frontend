import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class WealthMonthlyService {

  fullApiurlTable: string;
  uriTable: string = "financial/data/wealthmonthly";
  public uriAttachment: string = "/WealthMonthly";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllWealthMonthlyTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getWealthMonthlyById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveWealthMonthly(monthDate, yearDate, expenseCent, earningCent, differenceCent, improvementPct, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const newWealthMonthly = {
      monthDate: monthDate,
      yearDate: yearDate,
      expenseCent: expenseCent,
      earningCent: earningCent,
      differenceCent: differenceCent,
      improvementPct: improvementPct,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newWealthMonthly);
  }

  updateWealthMonthly(wealthmonthlyId, monthDate, yearDate, expenseCent, earningCent, differenceCent, improvementPct, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedWealthMonthly = {
      wealthmonthlyId: wealthmonthlyId,
      monthDate: monthDate,
      yearDate: yearDate,
      expenseCent: expenseCent,
      earningCent: earningCent,
      differenceCent: differenceCent,
      improvementPct: improvementPct,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedWealthMonthly);
  }

  updateWealthMonthlyTable(wealthmonthlyId, monthDate, yearDate, expenseCent, earningCent, differenceCent, improvementPct, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedWealthMonthly = {
      wealthmonthlyId: wealthmonthlyId,
      monthDate: monthDate,
      yearDate: yearDate,
      expenseCent: expenseCent,
      earningCent: earningCent,
      differenceCent: differenceCent,
      improvementPct: improvementPct,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedWealthMonthly);
  }

  deleteWealthMonthly(wealthmonthlyId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${wealthmonthlyId}`);
  }

  addWealthMonthlyAttachment(id, extension, file) {
    return this.httpClient.put(`${this.apiConfig.baseAttachmentUrl}${this.uriAttachment}/${id}.${extension}`, file, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Authorization": "Basic " + btoa(this.apiConfig.webDavUsername + ":" + this.apiConfig.webDavPassword) }) });
  }

}
