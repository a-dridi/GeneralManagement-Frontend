import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfig } from './util/api.config';
import { UserAuthentication } from './util/user-authentication';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  fullApiurlTable: string;
  uriTable: string = "settings/user";
  userId: number;

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfig, private userAuthentication: UserAuthentication) {
    this.fullApiurlTable = this.apiConfig.apiUrl + "/" + this.uriTable;
  }

  loadUserId() {
    this.userId = this.userAuthentication.getUserAuthenticationUserId();
  }

  getUserSettingBySettingsKey(settingsKey) {
    this.loadUserId();
    return this.httpClient.get(`${this.fullApiurlTable}/get/userSetting/bySettingsKey/${settingsKey}/${this.userId}`);
  }

  saveSettingsValue(newUserSetting) {
    this.loadUserId();
    const updatedUserSetting = {
      userSettingId: newUserSetting.userSettingId,
      settingKey: newUserSetting.settingKey,
      settingValue: newUserSetting.settingValue,
      userId: newUserSetting.userId
    };
    return this.httpClient.post(`${this.fullApiurlTable}/updateSetting`, updatedUserSetting);
  }

}
