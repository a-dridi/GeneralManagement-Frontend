import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class WealthYearlyService {

  fullApiurlTable: string;
  uriTable: string = "financial/data/wealthyearly";
  public uriAttachment: string = "/WealthYearly";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllWealthYearlyTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getWealthYearlyById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveWealthYearly(monthDate, yearDate, expenseCent, earningCent, differenceCent, improvementPct, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const newWealthYearly = {
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
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newWealthYearly);
  }

  updateWealthYearly(wealthyearlyId, yearDate, expenseCent, earningCent, differenceCent, improvementPct, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedWealthYearly = {
      wealthyearlyId: wealthyearlyId,
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
    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedWealthYearly);
  }

  updateWealthYearlyTable(wealthyearlyId, yearDate, expenseCent, earningCent, differenceCent, improvementPct, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedWealthYearly = {
      wealthyearlyId: wealthyearlyId,
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
    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedWealthYearly);
  }

  deleteWealthYearly(wealthyearlyId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${wealthyearlyId}`);
  }

  addWealthYearlyAttachment(id, extension, file) {
    return this.httpClient.put(`${this.apiConfig.baseAttachmentUrl}${this.uriAttachment}/${id}.${extension}`, file, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Authorization": "Basic " + btoa(this.apiConfig.webDavUsername + ":" + this.apiConfig.webDavPassword) }) });
  }

}
