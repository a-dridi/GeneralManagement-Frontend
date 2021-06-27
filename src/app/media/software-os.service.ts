import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class SoftwareOsService {

  fullApiurlTable: string;
  uriTable: string = "media/data/softwareos";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllSoftwareOs() {
    return this.httpClient.get(`${this.fullApiurlTable}/all`);
  }

  getSoftwareOsById(id) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  getSoftwareOsByTitle(title) {
    return this.httpClient.get(`${this.fullApiurlTable}/get/byTitle/${title}`);
  }

  saveSoftwareOs(title) {
    return this.httpClient.post(`${this.fullApiurlTable}/add`, title);
  }

  updateSoftwareOs(softwareosId, osTitle) {
    const updatedSoftwareOs = {
      softwareosId: softwareosId,
      osTitle: osTitle
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update/${softwareosId}`, updatedSoftwareOs);
  }

  deleteSoftwareOsById(softwareosId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/byId/${softwareosId}`);
  }

}
