import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DatabaseNoteService } from '../database-note/database-note.service';
import { ApiConfig } from '../util/api.config';
import { AppLanguages, AppLanguageLoaderHelper } from '../util/languages.config';
import { SoftwareService } from './software.service';
import { SoftwareComponent } from './software/software.component';
import { MusicComponent } from './music/music.component';
import { VideoComponent } from './video/video.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { VideoclipComponent } from './videoclip/videoclip.component';
import { MediaTableComponent } from './media-table/media-table.component';
import { VideoGraphComponent } from './video-graph/video-graph.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [SoftwareComponent, MusicComponent, VideoComponent, VideoclipComponent, MediaTableComponent, VideoGraphComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SharedModuleModule,
    HttpClientModule,
    FontAwesomeModule,
    ButtonModule,
    TabViewModule,
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
    ChartModule,
    ToggleButtonModule,
    TooltipModule
  ],
  exports: [
    TranslateModule,
  ],
  providers: [ApiConfig, TranslateService, AppLanguages, AppLanguageLoaderHelper, DatabaseNoteService, MessageService, SoftwareService]
})
export class MediaModule { }
