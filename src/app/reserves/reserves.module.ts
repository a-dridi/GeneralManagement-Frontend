import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservesTableComponent } from './reserves-table/reserves-table.component';
import { ReservesCategoryService } from './reserves-category.service';
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
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ApiConfig } from '../util/api.config';
import { AppLanguages, AppLanguageLoaderHelper } from '../util/languages.config';
import { ReservesTableService } from './reserves-table.service';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
  declarations: [ReservesTableComponent],
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
    AccordionModule,
    TooltipModule
  ],
  exports: [
    TranslateModule,
    ReservesTableComponent
    ],
  providers: [ApiConfig, TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService, MessageService, ReservesTableService, ReservesCategoryService]

})
export class ReservesModule { }
