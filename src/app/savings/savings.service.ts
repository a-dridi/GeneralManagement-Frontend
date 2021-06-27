import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class SavingsService {

  fullApiurlTable: string;
  uriTable: string = "financial/data/savings";
  public uriAttachment: string = "/Savings";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllSavingsTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getSavingsById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveSavings(description, targetCent, stepAmountCent, savingsFrequency, savedTillNowCent, lastSavingsUpdateDate, startDate, targetCalculatedDate, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const newSavings = {
      description: description,
      targetCent: targetCent,
      stepAmountCent: stepAmountCent,
      savingsFrequency: savingsFrequency,
      savedTillNowCent: savedTillNowCent,
      lastSavingsUpdateDate: lastSavingsUpdateDate,
      startDate: startDate,
      targetCalculatedDate: targetCalculatedDate,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/add`, newSavings);
  }

  updateSavings(savingsId, description, targetCent, stepAmountCent, savingsFrequency, savedTillNowCent, lastSavingsUpdateDate, startDate, targetCalculatedDate, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedSavings = {
      savingsId: savingsId,
      description: description,
      targetCent: targetCent,
      stepAmountCent: stepAmountCent,
      savingsFrequency: savingsFrequency,
      savedTillNowCent: savedTillNowCent,
      lastSavingsUpdateDate: lastSavingsUpdateDate,
      startDate: startDate,
      targetCalculatedDate: targetCalculatedDate,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedSavings);
  }

  updateSavingsTable(savingsId, description, targetCent, stepAmountCent, savingsFrequency, savedTillNowCent, lastSavingsUpdateDate, startDate, targetCalculatedDate, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedSavings = {
      savingsId: savingsId,
      description: description,
      targetCent: targetCent,
      stepAmountCent: stepAmountCent,
      savingsFrequency: savingsFrequency,
      savedTillNowCent: savedTillNowCent,
      lastSavingsUpdateDate: lastSavingsUpdateDate,
      startDate: startDate,
      targetCalculatedDate: targetCalculatedDate,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedSavings);
  }

  deleteSavings(savingsId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${savingsId}`);
  }

  restoreDeletedSavings(savingsId) {
    return this.httpClient.get(`${this.fullApiurlTable}/restore/${savingsId}`);
  }

  addSavingsAttachment(id, extension, file) {
    return this.httpClient.put(`${this.apiConfig.baseAttachmentUrl}${this.uriAttachment}/${id}.${extension}`, file, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Authorization": "Basic " + btoa(this.apiConfig.webDavUsername + ":" + this.apiConfig.webDavPassword) }) });
  }

}
