import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class CryptoTransactionsService {

  fullApiurlTable: string;
  uriTable: string = "financial/data/cryptocurrencytransactions";
  public uriAttachment: string = "/CryptoCurrencyTransactionsTransactions";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getAllCryptoCurrencyTransactionsTable() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/all/${this.userId}`);
  }

  getCryptoCurrencyTransactionsById(id) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/byId/${id}`);
  }

  saveCryptoCurrencyTransactions(senderFrom, currencyFrom, destinationTo, currencyTo, amount, storageLocation, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const newCryptoCurrencyTransactions = {
      senderFrom: senderFrom,
      currencyFrom: currencyFrom,
      destinationTo: destinationTo,
      currencyTo: currencyTo,
      amount: amount,
      storageLocation: storageLocation,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/add`, newCryptoCurrencyTransactions);
  }

  updateCryptoCurrencyTransactions(cryptocurrencytransactionsId, senderFrom, currencyFrom, destinationTo, currencyTo, amount, storageLocation, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();

    const updatedCryptoCurrencyTransactions = {
      cryptocurrencytransactionId: cryptocurrencytransactionsId,
      senderFrom: senderFrom,
      currencyFrom: currencyFrom,
      destinationTo: destinationTo,
      currencyTo: currencyTo,
      amount: amount,
      storageLocation: storageLocation,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };


    return this.httpClient.post(`${this.fullApiurlTable}/update`, updatedCryptoCurrencyTransactions);
  }

  updateCryptoCurrencyTransactionsTable(cryptocurrencytransactionsId, senderFrom, currencyFrom, destinationTo, currencyTo, amount, storageLocation, notice, attachment, attachmentPath, attachmentName, attachmentType) {
    this.loadUserId();
    const updatedCryptoCurrencyTransactions = {
      cryptocurrencytransactionId: cryptocurrencytransactionsId,
      senderFrom: senderFrom,
      currencyFrom: currencyFrom,
      destinationTo: destinationTo,
      currencyTo: currencyTo,
      amount: amount,
      storageLocation: storageLocation,
      notice: notice,
      attachment: attachment,
      attachmentPath: attachmentPath,
      attachmentName: attachmentName,
      attachmentType: attachmentType,
      deleted: false,
      userId: this.userId
    };

    return this.httpClient.post(`${this.fullApiurlTable}/updateTableData`, updatedCryptoCurrencyTransactions);
  }

  deleteCryptoCurrencyTransactions(reservesId) {
    return this.httpClient.delete(`${this.fullApiurlTable}/delete/${reservesId}`);
  }

  restoreDeletedCryptoCurrencyTransactions(reservesId) {
    return this.httpClient.get(`${this.fullApiurlTable}/restore/${reservesId}`);
  }

  addCryptoCurrencyTransactionsAttachment(id, extension, file) {
    return this.httpClient.put(`${this.apiConfig.baseAttachmentUrl}${this.uriAttachment}/${id}.${extension}`, file, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Authorization": "Basic " + btoa(this.apiConfig.webDavUsername + ":" + this.apiConfig.webDavPassword) }) });
  }

}
