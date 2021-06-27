import { Component, OnInit } from '@angular/core';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ResponseMessage } from '../component-parts/response-message.model';
import { UserSettingsService } from '../user-settings.service';
import { UserSetting } from '../user/model/user-setting.model';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.scss']
})
export class FrontpageComponent implements OnInit {

  noteTableName = "Frontpage";
  noteHeight = "150px";
  loggedInUser: string;
  faAngleDoubleRight = faAngleDoubleRight;
  expensesTabHeader: string;
  organizationsTabHeader: string;
  currentDate: string;
  //Settings
  selectedCurrency: string = "USD";

  baseCurrency: string;
  targetValue1: string;
  targetCurrency1: string;
  targetValue2: string;
  targetCurrency2: string;
  targetValue3: string;
  targetCurrency3: string;
  targetValue4: string;
  targetCurrency4: string;
  targetValue5: string;
  targetCurrency5: string;
  targetValue6: string;
  targetCurrency6: string;
  targetValue7: string;
  targetCurrency7: string;

  constructor(private userService: UserService, private translateService: TranslateService, private userSettingsService: UserSettingsService) { }

  ngOnInit(): void {
    this.userService.getUserEmailByUserId().subscribe((email: ResponseMessage) => {
      this.loggedInUser = email.message;
    }, err => { console.log(err); });

    this.translateService.get(['siteMenu.menuPointExpense', 'siteMenu.menupointOrganization']).subscribe(translations => {
      this.expensesTabHeader = translations['siteMenu.menuPointExpense'];
      this.organizationsTabHeader = translations['siteMenu.menupointOrganization'];
    });
    const date = new Date();
    this.currentDate = date.toLocaleString("default", { weekday: "long" }) + ", " + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    this.loadUserSettingsAndCurrencyRates();
  }

  loadCurrencyRates() {
    this.baseCurrency = this.setOnlyCertainBaseCurrency(this.selectedCurrency);

    fetch("https://www.floatrates.com/daily/" + this.baseCurrency.toLowerCase() + ".json")
      .then(response => {
        return response.json();
      }).then(jsonObject => {
        if (this.baseCurrency === "EUR") {
          this.targetCurrency1 = "USD";
          this.targetValue1 = parseFloat(jsonObject.usd.rate).toFixed(2);
        } else {
          this.targetCurrency1 = "EUR";
          this.targetValue1 = parseFloat(jsonObject.eur.rate).toFixed(2);
        }
        if (this.baseCurrency === "CHF") {
          this.targetCurrency2 = "USD";
          this.targetValue2 = parseFloat(jsonObject.usd.rate).toFixed(2);
        } else {
          this.targetCurrency2 = "CHF";
          this.targetValue2 = parseFloat(jsonObject.chf.rate).toFixed(2);
        }
        if (this.baseCurrency === "GBP") {
          this.targetCurrency3 = "USD";
          this.targetValue3 = parseFloat(jsonObject.usd.rate).toFixed(2);
        } else {
          this.targetCurrency3 = "GBP";
          this.targetValue3 = parseFloat(jsonObject.gbp.rate).toFixed(2);
        }
        this.targetCurrency4 = "KRW";
        this.targetValue4 = parseFloat(jsonObject.krw.rate).toFixed(2);
        this.targetCurrency5 = "TND";
        this.targetValue5 = parseFloat(jsonObject.tnd.rate).toFixed(2);
      });

    fetch("https://api.coinbase.com/v2/prices/BTC-" + this.baseCurrency + "/spot")
      .then(response => {
        return response.json();
      }).then(jsonObject => {
        this.targetCurrency6 = "BTC";
        this.targetValue6 = (parseInt(jsonObject.data.amount)).toFixed(2);
      });

    fetch("https://api.coinbase.com/v2/prices/ETH-" + this.baseCurrency + "/spot")
      .then(response => {
        return response.json();
      }).then(jsonObject => {
        this.targetCurrency7 = "ETH";
        this.targetValue7 = (parseInt(jsonObject.data.amount)).toFixed(2);
      });
  }

  /**
 * All here needed user settings and currency rates. 
 */
  loadUserSettingsAndCurrencyRates() {
    this.userSettingsService.getUserSettingBySettingsKey("currency").subscribe((userSetting: UserSetting) => {
      this.selectedCurrency = userSetting.settingValue;
      this.loadCurrencyRates();
    }, err => {
      console.log(err);
    });
  }

  /**
   * Filter and allow only certain base currency that can be set.
   * @param selectedCurrency 
   */
  setOnlyCertainBaseCurrency(selectedCurrency) {
    if (selectedCurrency === "EUR") {
      return selectedCurrency;
    }
    else if (selectedCurrency === "USD") {
      return selectedCurrency;
    }
    else if (selectedCurrency === "GBP") {
      return selectedCurrency;
    }
    else if (selectedCurrency === "JPY") {
      return selectedCurrency;
    }
    else if (selectedCurrency === "CHF") {
      return selectedCurrency;
    }
    else if (selectedCurrency === "CNY") {
      return selectedCurrency;
    }
    else {
      return "USD";
    }
  }

}
