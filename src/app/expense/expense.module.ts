import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseComponent } from './expense.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TabViewModule } from 'primeng/tabview';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ExpenseTableComponent } from './expense-table/expense-table.component';
import { ExpenseCategoryComponent } from './expense-category/expense-category.component';
import { ExpenseBudgetComponent } from './expense-budget/expense-budget.component';
import { ExpenseGraphComponent } from './expense-graph/expense-graph.component';
import { ExpenseCalendarComponent } from './expense-calendar/expense-calendar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
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
import { ChartModule } from 'primeng/chart';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { AccordionModule } from 'primeng/accordion';
import { ExpenseDevelopmentComponent } from './expense-development/expense-development.component';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { FieldsetModule } from 'primeng/fieldset';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    ExpenseComponent,
    ExpenseTableComponent,
    ExpenseCategoryComponent,
    ExpenseBudgetComponent,
    ExpenseGraphComponent,
    ExpenseCalendarComponent,
    ExpenseDevelopmentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModuleModule,
    FontAwesomeModule,
    TabViewModule,
    ButtonModule,
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
    InputNumberModule,
    ChartModule,
    FullCalendarModule,
    AccordionModule,
    TooltipModule,
    RippleModule,
    FieldsetModule,
    CheckboxModule
  ],
  exports: [
    TranslateModule,
    ExpenseComponent,
    ExpenseTableComponent,
    ExpenseCategoryComponent,
    ExpenseBudgetComponent,
    ExpenseGraphComponent,
    ExpenseCalendarComponent,
  ],
  providers: [ApiConfig, TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService, ExpenseService, MessageService]
})
export class ExpenseModule { }