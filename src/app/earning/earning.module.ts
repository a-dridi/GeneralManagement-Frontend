import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DatabaseNoteService } from 'src/app/database-note/database-note.service';
import { ApiConfig } from 'src/app/util/api.config';
import { AppLanguages, AppLanguageLoaderHelper } from 'src/app/util/languages.config';
import { EarningService } from './earning.service';
import { EarningComponent } from '../earning/earning.component';
import { EarningTableComponent } from './earning-table/earning-table.component';
import { EarningCategoriesComponent } from './earning-categories/earning-categories.component';
import { EarningDevelopmentComponent } from './earning-development/earning-development.component';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';



@NgModule({
  declarations: [EarningComponent, EarningTableComponent, EarningCategoriesComponent, EarningDevelopmentComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModuleModule,
    HttpClientModule,
    FontAwesomeModule,
    TabViewModule,
    ButtonModule,
    MatSidenavModule,
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
    RippleModule
  ],
  exports: [
    TranslateModule,
    EarningComponent, EarningTableComponent, EarningCategoriesComponent, EarningDevelopmentComponent
  ],
  providers: [ApiConfig, TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService, EarningService, MessageService]
})
export class EarningModule { }
