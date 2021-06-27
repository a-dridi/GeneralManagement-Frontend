import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { faBars, faBook, faChartLine, faGlobe, faHandHoldingUsd, faHeart, faHome, faLifeRing, faPiggyBank, faPlayCircle, faPollH, faReceipt, faSearchLocation, faTools } from '@fortawesome/free-solid-svg-icons';
import { AppLanguageLoaderHelper, AppLanguages, Language } from './util/languages.config';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import { RefererCache } from './util/refererCache';
import { MessageService } from 'primeng/api';
import { SwUpdate } from '@angular/service-worker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'General Management';

  faHeart = faHeart;
  faGlobe = faGlobe;
  faBars = faBars;
  faHome = faHome;
  faReceipt = faReceipt;
  faSearchLocation = faSearchLocation;
  faBook = faBook;
  faPiggyBank = faPiggyBank;
  faChartLine = faChartLine;
  faPlayCircle = faPlayCircle;
  faTools = faTools;
  faHandHoldingUsd = faHandHoldingUsd;
  faLifeRing = faLifeRing;
  faBitcoin = faBitcoin;
  faPollH = faPollH;

  //Listen for mobile devices
  responsiveMobileQuery: MediaQueryList;

  availableLanguages: Language[];
  selectedUserLanguageCode: string = "";
  selectedUserLanguageName: string = "";
  displayLanguageChooser: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher, private translate: TranslateService, private appLanguages: AppLanguages, private appLanguageLoaderHelper: AppLanguageLoaderHelper, private refererCache: RefererCache, private messageService: MessageService, private swUpdate: SwUpdate, private router: Router) {
    this.swUpdate.available.subscribe(event => {
      //Show warn message about new update available
      this.translate.get(['messages.pwaUpdateHeader1', 'messages.pwaUpdateMessage1']).subscribe(translations => {
        this.messageService.add({ severity: 'warn', summary: (translations['messages.pwaUpdateHeader1']), detail: (translations['messages.pwaUpdateMessage1']) });
      });
    });
  }

  ngOnInit(): void {
    this.selectedUserLanguageCode = this.appLanguageLoaderHelper.userLanguageCode;
    this.selectedUserLanguageName = this.appLanguageLoaderHelper.getLanguageNameFromLanguageList(this.selectedUserLanguageCode);
    this.translate.addLangs(this.appLanguages.languagesIsoCode);
    this.translate.use(this.selectedUserLanguageCode);
    this.translate.setDefaultLang(this.selectedUserLanguageCode);
    this.availableLanguages = this.appLanguages.languages;

    this.responsiveMobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.responsiveMobileQuery.addEventListener("DOMContentLoaded", () => this.changeDetectorRef.detectChanges());

    this.refererCache.addUriToCache(window.location.pathname);
  }

  ngOnDestroy(): void {
    this.responsiveMobileQuery.removeEventListener("DOMContentLoaded", () => this.changeDetectorRef.detectChanges());
  }

  /**
* Change translation to the selected language and save selected language in session.
* @param newSelectedLanguage language code iso code. Example: en
*/
  changeSelectedLanguage(newSelectedLanguage) {
    let selectedLanguageObject = this.appLanguageLoaderHelper.getLanguageObjectByLanguageCode(newSelectedLanguage);

    this.selectedUserLanguageName = selectedLanguageObject.languageName;
    this.translate.use(newSelectedLanguage);
    this.appLanguageLoaderHelper.userLanguageCode = newSelectedLanguage;
    this.refreshPage();
    this.displayLanguageChooser = false;
  }

  refreshPage() {
    let currentUrlPath = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrlPath]);
  }

  showLanguageChooser() {
    this.displayLanguageChooser = true;
  }
}
