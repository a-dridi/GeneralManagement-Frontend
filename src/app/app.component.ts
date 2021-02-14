import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { faBars, faGlobe, faHeart, faHome, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { AppLanguageLoaderHelper, AppLanguages, Language } from './util/languages.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'generalmanagement';
  faHeart = faHeart;
  faGlobe = faGlobe;
  faBars = faBars;
  faHome = faHome;
  faReceipt = faReceipt;
  //Listen for mobile devices
  responsiveMobileQuery: MediaQueryList;

  availableLanguages: Language[];
  selectedUserLanguageCode: string = "";
  selectedUserLanguageName: string = "";
  displayLanguageChooser: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher, private translate: TranslateService, private appLanguages: AppLanguages, private appLanguageLoaderHelper: AppLanguageLoaderHelper) {
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
  }

  ngOnDestroy(): void {
    this.responsiveMobileQuery.removeEventListener("DOMContentLoaded", () => this.changeDetectorRef.detectChanges());
  }

  /**
* Change translation to the selected language and save selected language in session.
* @param newSelectedLanguage 
*/
  changeSelectedLanguage(newSelectedLanguage) {
    this.selectedUserLanguageCode = newSelectedLanguage.code;
    this.selectedUserLanguageName = newSelectedLanguage.value;
    this.translate.use(newSelectedLanguage.code);
    this.appLanguageLoaderHelper.userLanguageCode = newSelectedLanguage.code;
    this.selectedUserLanguageName = this.appLanguageLoaderHelper.getLanguageNameFromLanguageList(this.appLanguageLoaderHelper.userLanguageCode);
    this.displayLanguageChooser = false;
  }


  showLanguageChooser(){
    this.displayLanguageChooser = true;
  }
}
