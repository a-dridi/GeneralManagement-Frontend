import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class SoftwareService {

  fullApiurlTable: string;
  uriTable: string = "media/data/software";
  public uriAttachment: string = "/Software";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication, private router: Router) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllSoftwareTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getSoftwareById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveSoftware(title, softwareOs, manufacturer, language, version, notice, linkValue, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const newSoftware = {
      title: title,
      softwareOs: softwareOs,
      manufacturer: manufacturer,
      language: language,
      version: version,
      notice: notice,
      linkValue: linkValue,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newSoftware);
  }

  updateSoftware(softwareId, title, softwareOs, manufacturer, language, version, notice, linkValue, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedSoftware = {
      softwareId: softwareId,
      title: title,
      softwareOs: softwareOs,
      manufacturer: manufacturer,
      language: language,
      version: version,
      notice: notice,
      linkValue: linkValue,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedSoftware);
  }

  updateSoftwareTable(softwareId, title, softwareOs, manufacturer, language, version, notice, linkValue, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedSoftware = {
      softwareId: softwareId,
      title: title,
      softwareOs: softwareOs,
      manufacturer: manufacturer,
      language: language,
      version: version,
      notice: notice,
      linkValue: linkValue,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedSoftware);
  }

  deleteSoftware(softwareId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${softwareId}`);
  }

  restoreDeletedSoftware(softwareId) {
    return this.httpClient.get(`${this.fullApiurlTable}/restore/${softwareId}`);
  }

  addSoftwareAttachment(id, extension, file) {
    return this.httpClient.put(`${this.apiConfig.baseAttachmentUrl}${this.uriAttachment}/${id}.${extension}`, file, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Authorization": "Basic " + btoa(this.apiConfig.webDavUsername + ":" + this.apiConfig.webDavPassword) }) });
  }

  updateSoftwareOsOfSoftwares(oldSoftwareOsId, newSoftwareOsId) {
    return this.httpClient.get(`${this.fullApiurlTable}/updateSoftwareOs/${oldSoftwareOsId}/${newSoftwareOsId}/${this.userId}`);
  }
}
