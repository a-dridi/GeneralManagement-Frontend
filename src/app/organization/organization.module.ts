import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NoteeditorComponent } from '../component-parts/noteeditor/noteeditor.component';
import { ButtonModule } from 'primeng/button';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { OrganizationTableComponent } from './organization-table/organization-table.component';
import { OrganizationService } from './organization.service';
import { OrganizationComponent } from './organization.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    OrganizationTableComponent,
    OrganizationComponent
  ],
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
    OrganizationTableComponent,
    OrganizationComponent
  ],
  providers: [ApiConfig, TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService, MessageService, OrganizationService]
})
export class OrganizationModule { }