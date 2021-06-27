import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class CryptoCurrencyService {

  fullApiurlTable: string;
  uriTable: string = "financial/data/cryptocurrency";
  public uriAttachment: string = "/CryptoCurrency";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllCryptoCurrencyTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getCryptoCurrencyById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveCryptoCurrency(amount, currency, storageLocation, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const newCryptoCurrency = {
      amount: amount,
      currency: currency,
      storageLocation: storageLocation,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newCryptoCurrency);
  }

  updateCryptoCurrency(cryptocurrencyId, amount, currency, storageLocation, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();

    const updatedCryptoCurrency = {
      cryptocurrencyId: cryptocurrencyId,
      amount: amount,
      currency: currency,
      storageLocation: storageLocation,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedCryptoCurrency);
  }

  updateCryptoCurrencyTable(cryptocurrencyId, amount, currency, storageLocation, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedCryptoCurrency = {
      cryptocurrencyId: cryptocurrencyId,
      amount: amount,
      currency: currency,
      storageLocation: storageLocation,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedCryptoCurrency);
  }

  deleteCryptoCurrency(reservesId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${reservesId}`);
  }

  restoreDeletedCryptoCurrency(reservesId) {
    return this.httpClient.get(`${this.fullApiurlTable}/restore/${reservesId}`);
  }

  addCryptoCurrencyAttachment(id, extension, file) {
    return this.httpClient.put(`${this.apiConfig.baseAttachmentUrl}${this.uriAttachment}/${id}.${extension}`, file, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Authorization": "Basic " + btoa(this.apiConfig.webDavUsername + ":" + this.apiConfig.webDavPassword) }) });
  }

}
