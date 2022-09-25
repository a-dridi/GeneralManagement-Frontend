import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecisionItemComponent } from './decision-item/decision-item.component';
import { DecisionTableComponent } from './decision-table/decision-table.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { CriteriaOptionService } from './criteria-option.service';
import { DecisionOptionService } from './decision-option.service';
import { DecisionService } from './decision.service';
import { OptionPointService } from './option-point.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DatabaseNoteService } from '../database-note/database-note.service';
import { ApiConfig } from '../util/api.config';
import { AppLanguages, AppLanguageLoaderHelper } from '../util/languages.config';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RippleModule } from 'primeng/ripple';
import {InputNumberModule} from 'primeng/inputnumber';

@NgModule({
  declarations: [DecisionItemComponent, DecisionTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModuleModule,
    HttpClientModule,
    FontAwesomeModule,
    ButtonModule,
    MatSidenavModule,
    MatInputModule, 
    MatToolbarModule,
    MatListModule,
    DropdownModule,
    DialogModule,
    ListboxModule,
    InputTextModule,
    TableModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RippleModule,
    InputNumberModule
  ],
  exports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    InputNumberModule,
    DecisionItemComponent, DecisionTableComponent
  ],
  providers: [ApiConfig, TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService, MessageService, CriteriaOptionService, DecisionOptionService, DecisionService, OptionPointService]
})
export class DecisionModule { }
