import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { TabViewModule } from 'primeng/tabview';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { DropdownModule } from 'primeng/dropdown';
import { ApiConfig } from './util/api.config';
import { AppLanguageLoaderHelper, AppLanguages } from './util/languages.config';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { DatabaseNoteService } from './database-note/database-note.service';
import { ExpenseModule } from './expense/expense.module';
import { ToastModule } from 'primeng/toast';
import { AuthenticationInterceptor } from './authentication.interceptor';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { OrganizationModule } from './organization/organization.module';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localeKo from '@angular/common/locales/ko';
import localeAr from '@angular/common/locales/ar';

import { EarningModule } from './earning/earning.module';
import { BookModule } from './book/book.module';
import { SavingsModule } from './savings/savings.module';
import { AccordionModule } from 'primeng/accordion';
import { SharedModuleModule } from './shared-module/shared-module.module';
import { WealthModule } from './wealth/wealth.module';
import { ReservesModule } from './reserves/reserves.module';
import { CryptoCurrencyModule } from './crypto-currency/crypto-currency.module';
import { DecisionModule } from './decision/decision.module';
import { MediaModule } from './media/media.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MessageService } from 'primeng/api';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

@NgModule({
  declarations: [
    AppComponent,
    FrontpageComponent,
    UserLoginComponent,
    UserSettingsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: false
    }),
    AppRoutingModule,
    FontAwesomeModule,
    TabViewModule,
    ButtonModule,
    AccordionModule,
    AngularEditorModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    DropdownModule,
    DialogModule,
    ListboxModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    ExpenseModule,
    EarningModule,
    OrganizationModule,
    BookModule,
    SavingsModule,
    WealthModule,
    ReservesModule,
    CryptoCurrencyModule,
    SharedModuleModule,
    DecisionModule,
    MediaModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [TranslateModule],
  providers: [ApiConfig,
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthenticationInterceptor,
        multi: true
      }
    ],
    TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
    this.loadAvailableLocales();
  }

  loadAvailableLocales() {
    registerLocaleData(localeEn);
    registerLocaleData(localeDe);
    registerLocaleData(localeFr);
    registerLocaleData(localeEs);
    registerLocaleData(localeKo);
    registerLocaleData(localeAr);
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  //return new TranslateHttpLoader(http);
}

function localeUS(localeUS: any) {
  throw new Error('Function not implemented.');
}
function localeDE(localeDE: any) {
  throw new Error('Function not implemented.');
}

function localeFR(localeFR: any) {
  throw new Error('Function not implemented.');
}

