import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoCurrencyComponent } from './crypto-currency/crypto-currency.component';
import { CryptoCurrencyTransactionsComponent } from './crypto-currency-transactions/crypto-currency-transactions.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DatabaseNoteService } from '../database-note/database-note.service';
import { OrganizationTableComponent } from '../organization/organization-table/organization-table.component';
import { OrganizationComponent } from '../organization/organization.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ApiConfig } from '../util/api.config';
import { AppLanguages, AppLanguageLoaderHelper } from '../util/languages.config';
import { CryptoCurrencyService } from './crypto-currency.service';
import { CryptoTransactionsService } from './crypto-transactions.service';
import { TabViewModule } from 'primeng/tabview';
import { CryptoCurrencyModuleComponent } from './crypto-currency-module.component';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
  declarations: [CryptoCurrencyModuleComponent, CryptoCurrencyComponent, CryptoCurrencyTransactionsComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SharedModuleModule,
    HttpClientModule,
    FontAwesomeModule,
    ButtonModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    DropdownModule,
    DialogModule,
    ListboxModule,
    InputTextModule,
    FileUploadModule,
    TableModule,
    MultiSelectModule,
    ToastModule,
    InputNumberModule,
    TabViewModule,
    TooltipModule
  ],
  exports: [
    TranslateModule,
    CryptoCurrencyModuleComponent, CryptoCurrencyComponent, CryptoCurrencyTransactionsComponent
  ],
  providers: [ApiConfig, TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService, MessageService, CryptoCurrencyService, CryptoTransactionsService]

})
export class CryptoCurrencyModule { }
