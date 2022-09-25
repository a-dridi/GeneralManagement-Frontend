import { NgModule } from '@angular/core';
import { SavingsTableComponent } from './savings-table/savings-table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { DropdownModule } from 'primeng/dropdown';
import { ApiConfig } from '../util/api.config';
import { AppLanguageLoaderHelper, AppLanguages } from '../util/languages.config';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { DatabaseNoteService } from '../database-note/database-note.service';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { SavingsService } from './savings.service';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [SavingsTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModuleModule,
    HttpClientModule,
    FontAwesomeModule,
    ButtonModule,
    MatSidenavModule,
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
    TooltipModule
  ],
  exports: [
    TranslateModule
  ],
  providers: [ApiConfig, TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService, MessageService, SavingsService]

})
export class SavingsModule { }
