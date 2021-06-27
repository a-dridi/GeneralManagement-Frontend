import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  fullApiurlTable: string;
  uriTable: string = "common/data/organization";
  public uriAttachment: string = "/Organization";
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

  getAllOrganizationTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getOrganizationById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveOrganization(description, organizationCategory, location, status, information, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const newOrganization = {
      description: description,
      organizationCategory: organizationCategory,
      location: location,
      status: status,
      information: information,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newOrganization);
  }

  updateOrganization(organizationId, description, organizationCategory, location, status, information, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedOrganization= {
      organizationId: organizationId,
      description: description,
      organizationCategory: organizationCategory,
      location: location,
      status: status,
      information: information,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedOrganization);
  }

  updateOrganizationTable(organizationId, description, organizationCategory, location, status, information, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedOrganization = {
      organizationId: organizationId,
      description: description,
      organizationCategory: organizationCategory,
      location: location,
      status: status,
      information: information,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedOrganization);
  }

  deleteOrganization(organizationId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${organizationId}`);
  }

  restoreDeletedOrganization(organizationId) {
    return this.httpClient.get(`${this.fullApiurlTable}/restore/${organizationId}`);
  }

  addOrganizationAttachment(id, extension, file) {
    return this.httpClient.put(`${this.apiConfig.baseAttachmentUrl}${this.uriAttachment}/${id}.${extension}`, file, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Authorization": "Basic " + btoa(this.apiConfig.webDavUsername + ":" + this.apiConfig.webDavPassword) }) });
  }

  updateOrganizationCategoriesOfOrganizations(oldOrganizationCategoryId, newOrganizationCategoryId) {
    return this.httpClient.get(`${this.fullApiurlTable}/updateOrganizationCategories/${oldOrganizationCategoryId}/${newOrganizationCategoryId}/${this.userId}`);
  }

}
