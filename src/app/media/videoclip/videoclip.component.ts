import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faFont, faTags, faGlobe, faTable, faPlusCircle, faCheckSquare, faPlus, faFolderPlus, faArrowRight, faRetweet, faPaperclip, faUndo, faCalendarDay, faUserAlt, faAtlas, faLink } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { MessageCreator } from 'src/app/util/messageCreator';
import { VideoclipLanguage } from '../model/videoclip-language.model';
import { VideoclipTable } from '../model/videoclip-table.model';
import { Videoclip } from '../model/videoclip.model';
import { VideoclipLanguageService } from '../videoclip-language.service';
import { VideoclipService } from '../videoclip.service';

@Component({
  selector: 'app-videoclip',
  templateUrl: './videoclip.component.html',
  styleUrls: ['./videoclip.component.scss']
})
export class VideoclipComponent implements OnInit {

  standardTableWidth = 1584;

  readonly deleteCacheStorageId = "app32xVideoclipsDeleted";

  loading: boolean;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  videoclips: VideoclipTable[];
  videoclipsLength: number = 0;

  videoclipLanguages: VideoclipLanguage[];
  videoclipLanguageTitles: string[];

  //new videoclip data
  interpreter: string;
  videoTitle: string;
  videoclipLanguage: VideoclipLanguage;
  yearDate: number;
  nativeTitle: string;
  linkValue: string;

  newLanguageName: string;
  editSelectedVideoLanguage: VideoclipLanguage;
  updatedVideoLanguage: VideoclipLanguage;

  faFont = faFont;
  faTags = faTags;
  faGlobe = faGlobe;
  faUserAlt = faUserAlt;
  faAtlas = faAtlas;
  faLink = faLink;
  faTable = faTable;
  faPlusCircle = faPlusCircle;
  faCheckSquare = faCheckSquare;
  faPlus = faPlus;
  faFolderPlus = faFolderPlus;
  faArrowRight = faArrowRight;
  faRetweet = faRetweet;
  faPaperclip = faPaperclip;
  faUndo = faUndo;
  faCalendarDay = faCalendarDay;

  @ViewChild('languageselector') languageselector: ElementRef;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private messageCreator: MessageCreator, private messageService: MessageService, private videoclipService: VideoclipService, private videoclipLanguageService: VideoclipLanguageService, private translateService: TranslateService) {

  }

  /**
     * Load videoclips and table header translations
     */
  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['videoclip.videoclipAddInterpreterHeader', 'videoclip.videoclipAddVideoTitleHeader', 'videoclip.videoclipAddVideoclipLanguageHeader', 'videoclip.videoclipAddYearDateHeader', 'videoclip.videoclipAddNativeTitleHeader', 'videoclip.videoclipAddLinkValueHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'videoclipId', header: 'ID' },
        { field: 'interpreter', header: translations['videoclip.videoclipAddInterpreterHeader'] },
        { field: 'videoTitle', header: translations['videoclip.videoclipAddVideoTitleHeader'] },
        { field: 'videoclipLanguage', header: translations['videoclip.videoclipAddVideoclipLanguageHeader'] },
        { field: 'yearDate', header: translations['videoclip.videoclipAddYearDateHeader'] },
        { field: 'nativeTitle', header: translations['videoclip.videoclipAddNativeTitleHeader'] },
        { field: 'linkValue', header: translations['videoclip.videoclipAddLinkValueHeader'] }
      ];
      this.exportColumns = [
        { field: 'videoclipId', header: 'ID' },
        { field: 'interpreter', header: translations['videoclip.videoclipAddInterpreterHeader'] },
        { field: 'videoTitle', header: translations['videoclip.videoclipAddVideoTitleHeader'] },
        { field: 'videoclipLanguage', header: translations['videoclip.videoclipAddVideoclipLanguageHeader'] },
        { field: 'yearDate', header: translations['videoclip.videoclipAddYearDateHeader'] },
        { field: 'nativeTitle', header: translations['videoclip.videoclipAddNativeTitleHeader'] },
        { field: 'linkValue', header: translations['videoclip.videoclipAddLinkValueHeader'] }
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadVideoclipLanguages();
    this.loadVideoclips();
    this.loadInputEnterListener();
  }

  ngAfterViewInit() {
    this.loadDropdownStyle();
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }

  loadDropdownStyle() {
    if (this.languageselector) {
      this.languageselector.nativeElement.querySelector(".p-dropdown-label").style.fontSize = "20px";
      this.languageselector.nativeElement.querySelector(".p-dropdown-label").style.margin = "auto";
    }

  }

  /**
   * Submit input value when user enters "Enter".
   */
  loadInputEnterListener() {
    //Add language
    let addLanguageInput = document.getElementById("addVideoclipLanguageTitle");
    addLanguageInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addVideoclipLanguageButton").click();
      }
    });
  }

  reloadDropdown(event) {
    setTimeout(() => { this.loadDropdownStyle(); }, 100);
    this.loadDropdownStyle();
  }

  /**
   * Load videoclips and create videoclips array to display in the table. 
   */
  loadVideoclips() {
    this.videoclipService.getAllVideoclipTable().subscribe((data: Videoclip[]) => {
      this.videoclips = [];
      data.forEach(
        (videoclipItem: Videoclip) => {
          this.videoclips.push({ videoclipId: videoclipItem.videoclipId, interpreter: videoclipItem.interpreter, videoTitle: videoclipItem.videoTitle, videoclipLanguage: videoclipItem.videoclipLanguage.languageTitle, yearDate: videoclipItem.yearDate, nativeTitle: videoclipItem.nativeTitle, linkValue: videoclipItem.linkValue });
        });
      this.videoclipsLength = this.videoclips.length;
      this.loading = false;
    }, err => {
      console.log(err);
      this.videoclips = [];
      this.videoclipsLength = 0;
      this.loading = false;
    });
  }

  /**
   * Create array for languages. Create array of titles of languages, which is needed for the language update of a videoclip item. 
   */
  loadVideoclipLanguages() {
    this.videoclipLanguageService.getAllVideoclipLanguage().subscribe((data: VideoclipLanguage[]) => {
      this.videoclipLanguages = data;
      this.videoclipLanguageTitles = [];
      this.videoclipLanguages.forEach((videoLanguageItem) => {
        this.videoclipLanguageTitles.push(videoLanguageItem.languageTitle);
      });
    }, err => {
    });
  }


  /**
   * Reload videoclip data
   */
  reloadAllVideoclipData() {
    this.loadVideoclips();
    this.loadVideoclipLanguages();
  }

  /**
   * Delete videoclip item and save deleted videoclip in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteVideoclip(id) {
    this.videoclipService.deleteVideoclip(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.videoclipDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.videoclipDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllVideoclipData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.videoclipDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.videoclipDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.videoclipDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.videoclipDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedVideoclips() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.videoclipService.restoreDeletedVideoclip(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllVideoclipData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('videoclipRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('videoclipRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a videoclip row item. 
   * @param newValue 
   * @param videoclipItem 
   * @param columnName The column / attribute of the videoclip item that will be updated
   */
  updateVideoclipValue(newValue, videoclipItem, columnName) {
    //Load objects through the title
    let videoclipLanguageObject = this.getVideoclipLanguageByLanguageTitle(videoclipItem.videoclipLanguage);

    if (columnName === "interpreter") {
      this.videoclipService.updateVideoclipTable(videoclipItem.videoclipId, newValue, videoclipItem.videoTitle, videoclipLanguageObject, videoclipItem.yearDate, videoclipItem.nativeTitle, videoclipItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoclipTableUpdatedError1');
      });
    }
    else if (columnName === "videoTitle") {
      this.videoclipService.updateVideoclipTable(videoclipItem.videoclipId, videoclipItem.interpreter, newValue, videoclipLanguageObject, videoclipItem.yearDate, videoclipItem.nativeTitle, videoclipItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoclipTableUpdatedError1');
      });
    }
    else if (columnName === "videoclipLanguage") {
      videoclipLanguageObject = this.getVideoclipLanguageByLanguageTitle(newValue);
      this.videoclipService.updateVideoclipTable(videoclipItem.videoclipId, videoclipItem.interpreter, videoclipItem.videoTitle, videoclipLanguageObject, videoclipItem.yearDate, videoclipItem.nativeTitle, videoclipItem.linkValue).subscribe((res: String) => {
        this.loadVideoclips();
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoclipTableUpdatedError1');
      });
    }
    else if (columnName === "yearDate") {
      this.videoclipService.updateVideoclipTable(videoclipItem.videoclipId, videoclipItem.interpreter, videoclipItem.videoTitle, videoclipLanguageObject, newValue, videoclipItem.nativeTitle, videoclipItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoclipTableUpdatedError1');
      });
    }
    else if (columnName === "nativeTitle") {
      this.videoclipService.updateVideoclipTable(videoclipItem.videoclipId, videoclipItem.interpreter, videoclipItem.videoTitle, videoclipLanguageObject, videoclipItem.yearDate, newValue, videoclipItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoclipTableUpdatedError1');
      });
    }
    else if (columnName === "linkValue") {
      this.videoclipService.updateVideoclipTable(videoclipItem.videoclipId, videoclipItem.interpreter, videoclipItem.videoTitle, videoclipLanguageObject, videoclipItem.yearDate, videoclipItem.nativeTitle, newValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoclipTableUpdatedError1');
      });
    }
  }

  getVideoclipLanguageByLanguageTitle(videoclipLanguageTitle) {
    return this.videoclipLanguages.map(videoclipLanguageItem => {
      if (videoclipLanguageItem.languageTitle === videoclipLanguageTitle) {
        return videoclipLanguageItem;
      }
    }).filter(selectedVideoclipLanguage => { return selectedVideoclipLanguage })[0];
  }

  saveVideoclip() {
    if (this.videoTitle === null || typeof this.videoTitle === undefined || this.videoTitle.trim() === "") {
      this.messageCreator.showErrorMessage('videoclipAddVideoclipError1');
      return;
    }

    if (this.linkValue === null || typeof this.linkValue === undefined || this.linkValue.trim() === "") {
      this.messageCreator.showErrorMessage('videoclipAddVideoclipError2');
      return;
    }

    this.videoclipService.saveVideoclip(this.interpreter, this.videoTitle, this.videoclipLanguage, this.yearDate, this.nativeTitle, this.linkValue).subscribe((savedVideoclip: Videoclip) => {
      this.messageCreator.showSuccessMessage('videoclipAddVideoclipOK1');
      this.reloadAllVideoclipData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('videoclipAddVideoclipError4');
    });
  }

  addVideoclipLanguage() {
    if (this.newLanguageName.trim() !== "") {
      this.videoclipLanguageService.saveVideoclipLanguage(this.newLanguageName).subscribe(
        () => {
          this.messageCreator.showSuccessMessage('videoclipsTableAddLanguageOK1');
          this.loadVideoclipLanguages();
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage('videoclipsTableAddLanguageError1');
          this.loadVideoclipLanguages();
        });
    } else {
      this.messageCreator.showErrorMessage('videoclipsTableAddLanguageError2');
    }
  }

  updateLanguages() {
    if (this.editSelectedVideoLanguage != null) {
      this.videoclipService.updateVideoclipLanguagesOfVideoclips(this.editSelectedVideoLanguage.videocliplanguageId, this.updatedVideoLanguage.videocliplanguageId).subscribe(
        () => {
          this.reloadAllVideoclipData();
          this.messageCreator.showSuccessMessage("videoclipsEditLanguageOk1");
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage('videoclipsEditLanguageError2');
        });
    } else {
      this.messageCreator.showErrorMessage('videoclipsEditLanguageError1');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.videoclips);
        doc.save('videoclips.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.videoclips);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "videoclips");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  /**
   * Recreate original table object
   */
  resetExportTableData() {
    this.loadVideoclips();
  }

}
