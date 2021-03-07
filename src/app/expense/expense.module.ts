import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseComponent } from './expense.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TabViewModule } from 'primeng/tabview';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ExpenseTableComponent } from './expense-table/expense-table.component';
import { ExpenseCategoryComponent } from './expense-category/expense-category.component';
import { ExpenseBudgetComponent } from './expense-budget/expense-budget.component';
import { ExpenseGraphComponent } from './expense-graph/expense-graph.component';
import { ExpenseCalendarComponent } from './expense-calendar/expense-calendar.component';
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
import { ExpenseService } from './expense.service';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    ExpenseComponent,
    ExpenseTableComponent,
    ExpenseCategoryComponent,
    ExpenseBudgetComponent,
    ExpenseGraphComponent,
    ExpenseCalendarComponent,
    NoteeditorComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SharedModuleModule,
    HttpClientModule,
    FontAwesomeModule,
    TabViewModule,
    ButtonModule,
    AngularEditorModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    DropdownModule,
    DialogModule,
    ListboxModule,
    InputTextModule,
    CalendarModule,
    FileUploadModule,
    TableModule,
    MultiSelectModule,
    ToastModule,
    InputNumberModule
  ],
  exports: [
    TranslateModule,
    ExpenseComponent,
    ExpenseTableComponent,
    ExpenseCategoryComponent,
    ExpenseBudgetComponent,
    ExpenseGraphComponent,
    ExpenseCalendarComponent,
    NoteeditorComponent
  ],
  providers: [ApiConfig, TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService, ExpenseService, MessageService]
})
export class ExpenseModule { }