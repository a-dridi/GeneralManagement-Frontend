import { Component, OnInit } from '@angular/core';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { UserSetting } from '../user/model/user-setting.model';
import { UserSettingsService } from '../user-settings.service';
import { currencies } from '../util/currencies';
import { MessageCreator } from '../util/messageCreator';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  faDollarSign = faDollarSign;
  currencyArray = currencies;
  currencyObjectArray;
  loadedCurrencySetting: UserSetting;

  selectedCurrencyObject;

  constructor(private userSettingsService: UserSettingsService, private messageCreator: MessageCreator) { }

  ngOnInit(): void {
    this.currencyObjectArray = {};
    this.currencyArray.forEach(currencyObjectItem => {
      this.currencyObjectArray[currencyObjectItem.code] = (currencyObjectItem);
    });
    this.loadCurrencySetting();
  }

  loadCurrencySetting() {
    this.userSettingsService.getUserSettingBySettingsKey("currency").subscribe((userSetting: UserSetting) => {
      this.loadedCurrencySetting = userSetting;
      this.selectedCurrencyObject = this.currencyObjectArray[userSetting.settingValue];
    });
  }

  setCurrency(selectedObject) {
    if (selectedObject !== null) {
      this.selectedCurrencyObject = selectedObject
      this.loadedCurrencySetting.settingValue = this.selectedCurrencyObject.code;
      this.userSettingsService.saveSettingsValue(this.loadedCurrencySetting).subscribe(() => {
        this.messageCreator.showSuccessMessage("userSettingsOK1");
      }, err => {
        this.messageCreator.showSuccessMessage("userSettingsError1");
      });
    }
  }


}
