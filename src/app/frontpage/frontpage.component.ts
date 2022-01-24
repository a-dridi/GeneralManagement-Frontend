import { Component, OnInit } from '@angular/core';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ResponseMessage } from '../component-parts/response-message.model';
import { UserSettingsService } from '../user-settings.service';
import { UserSetting } from '../user/model/user-setting.model';
import { UserService } from '../user/user.service';
import { AppLanguageLoaderHelper } from '../util/languages.config';

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
  localeOfUser: string = "en";

  baseCurrency: string;
  targetValue1: number;
  targetCurrency1: string;
  targetValue2: number;
  targetCurrency2: string;
  targetValue3: number;
  targetCurrency3: string;
  targetValue4: number;
  targetCurrency4: string;
  targetValue5: number;
  targetCurrency5: string;
  targetValue6: number;
  targetCurrency6: string;
  targetValue7: number;
  targetCurrency7: string;


  constructor(private userService: UserService, private translateService: TranslateService, private userSettingsService: UserSettingsService, private appLanguageLoaderHelper: AppLanguageLoaderHelper) { }

  ngOnInit(): void {
    this.userService.getUserEmailByUserId().subscribe((email: ResponseMessage) => {
      this.loggedInUser = email.message;
    }, err => { console.log(err); });
    this.localeOfUser = this.appLanguageLoaderHelper.userLanguageCode;

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
          this.targetValue1 = parseFloat(jsonObject.usd.rate);
        } else {
          this.targetCurrency1 = "EUR";
          this.targetValue1 = parseFloat(jsonObject.eur.rate);
        }
        if (this.baseCurrency === "CHF") {
          this.targetCurrency2 = "USD";
          this.targetValue2 = parseFloat(jsonObject.usd.rate);
        } else {
          this.targetCurrency2 = "CHF";
          this.targetValue2 = parseFloat(jsonObject.chf.rate);
        }
        if (this.baseCurrency === "GBP") {
          this.targetCurrency3 = "USD";
          this.targetValue3 = parseFloat(jsonObject.usd.rate);
        } else {
          this.targetCurrency3 = "GBP";
          this.targetValue3 = parseFloat(jsonObject.gbp.rate);
        }
        this.targetCurrency4 = "KRW";
        this.targetValue4 = parseFloat(jsonObject.krw.rate);
        this.targetCurrency5 = "TND";
        this.targetValue5 = parseFloat((parseFloat(jsonObject.tnd.rate).toFixed(2)));
      });

    fetch("https://api.coinbase.com/v2/prices/BTC-" + this.baseCurrency + "/spot")
      .then(response => {
        return response.json();
      }).then(jsonObject => {
        this.targetCurrency6 = "BTC";
        this.targetValue6 = parseInt(jsonObject.data.amount);
      });

    fetch("https://api.coinbase.com/v2/prices/ETH-" + this.baseCurrency + "/spot")
      .then(response => {
        return response.json();
      }).then(jsonObject => {
        this.targetCurrency7 = "ETH";
        this.targetValue7 = parseInt(jsonObject.data.amount);
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
