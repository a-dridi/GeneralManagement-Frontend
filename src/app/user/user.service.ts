import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../util/api.config';
import { UserAuthentication } from '../util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  fullApiurl: string;
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurl = this.apiConfig.apiUrl;
  }


  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  /**
   * Do login and returns the user object and the headers (which contains also the JWT token in the header field "Authorization"). 
   * If login credentials are wrong or user does not exist, then an empty user object is returned with an error code.
   * 
   * Error codes and meanings:
   * Bad Request 400: Wrong password
   * Not Found 404: User with passed email does not exist!
   * Bad Gateway 502: Cannot read passed values and JSON object.
   * 
   * @param email 
   * @param password 
   */
  doLogin(email, password) {
    const loginCredentials = {
      email: email,
      password: password
    };
    return this.httpClient.post(`${this.fullApiurl}/login`, loginCredentials, { observe: 'response' });
  }

  getAuthenticatedUser(email, password) {
    const loginCredentials = {
      email: email,
      password: password
    };

    return this.httpClient.post(`${this.fullApiurl}/getUserId`, loginCredentials);
  }

  getUserEmailByUserId() {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurl}/getUserEmail/${this.userId}`);
  }

  authenticateWebDav() {
    return this.httpClient.get(`${this.apiConfig.baseAttachmentUrl}`, { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*', "Authorization": "Basic " + btoa(this.apiConfig.webDavUsername + ":" + this.apiConfig.webDavPassword) }) });
  }
}
