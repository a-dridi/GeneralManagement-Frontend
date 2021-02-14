import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiConfig } from '../util/api.config';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from '../authentication.interceptor';
import { AppLanguageLoaderHelper, AppLanguages } from '../util/languages.config';
import { DatabaseNoteService } from '../database-note/database-note.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [     
    HttpClientModule,
    TranslateModule
    ],
  providers: [ApiConfig,
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthenticationInterceptor,
        multi: true
      }
    ],
    TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService],
})
export class SharedModuleModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  //return new TranslateHttpLoader(http);
}