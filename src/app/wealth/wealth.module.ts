import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WealthMonthlyComponent } from './wealth-monthly/wealth-monthly.component';
import { WealthComponent } from './wealth.component';
import { WealthYearlyComponent } from './wealth-yearly/wealth-yearly.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { DatabaseNoteService } from '../database-note/database-note.service';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ApiConfig } from '../util/api.config';
import { AppLanguages, AppLanguageLoaderHelper } from '../util/languages.config';
import { WealthMonthlyService } from './wealth-monthly.service';
import { WealthYearlyService } from './wealth-yearly.service';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [WealthMonthlyComponent, WealthComponent, WealthYearlyComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SharedModuleModule,
    HttpClientModule,
    FontAwesomeModule,
    TabViewModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    InputTextModule,
    FileUploadModule,
    TableModule,
    ToastModule,
    InputNumberModule,
    TooltipModule
  ],
  exports: [
    TranslateModule,
    WealthMonthlyComponent, WealthComponent, WealthYearlyComponent
  ],
  providers: [ApiConfig, TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService, WealthMonthlyService, WealthYearlyService, MessageService]
})
export class WealthModule { }
