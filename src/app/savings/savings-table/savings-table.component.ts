import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faAdjust, faArrowRight, faBullseye, faCheckSquare, faFolderPlus, faFont, faHistory, faInfo, faPaperclip, faPlus, faPlusCircle, faRetweet, faSearchLocation, faSignal, faTable, faTags, faUndo } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { UserSettingsService } from 'src/app/user-settings.service';
import { UserSetting } from 'src/app/user/model/user-setting.model';
import { UserService } from 'src/app/user/user.service';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { MessageCreator } from 'src/app/util/messageCreator';
import { SavingsFrequency } from '../model/savings-frequency-model';
import { Savings } from '../model/savings.model';
import { SavingsService } from '../savings.service';

@Component({
  selector: 'app-savings-table',
  templateUrl: './savings-table.component.html',
  styleUrls: ['./savings-table.component.scss']
})
export class SavingsTableComponent implements OnInit {

  standardTableWidth = 1772;

  readonly deleteCacheStorageId = "app32xSavingsDeleted";

  loading: boolean;
  currency;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  savings: Savings[];
  savingsLength: number = 0;

  savingsFrequencyArray: SavingsFrequency[];
  savingsFrequencyTranslations;

  //new savings data
  description: string;
  targetCent: string;
  stepAmountCent: string;
  selectedFrequency: SavingsFrequency;
  notice: string;
  attachment: boolean = false;
  attachmentPath: string;
  attachmentName: string;
  attachmentType: string;
  attachmentFile: any;

  updatedAttachmentId: string;

  faFont = faFont;
  faInfo = faInfo;
  faTable = faTable;
  faPlusCircle = faPlusCircle;
  faCheckSquare = faCheckSquare;
  faPlus = faPlus;
  faRetweet = faRetweet;
  faPaperclip = faPaperclip;
  faUndo = faUndo;
  faAdjust = faAdjust;
  faBullseye = faBullseye;
  faHistory = faHistory;

  @ViewChild('frequencyselector') frequencyselector: ElementRef;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private userService: UserService, private messageCreator: MessageCreator, private messageService: MessageService, private userSettingsService: UserSettingsService, private apiConfig: ApiConfig, private savingsService: SavingsService, private translateService: TranslateService) {

  }

  /**
     * Load savingss and table header translations
     */
  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['savings.savingsAddDescriptionHeader', 'savings.savingsAddSavingsTargetHeader', 'savings.savingsAddStepAmountHeader', 'savings.savingsAddFrequencyHeader', 'savings.savingsAddSavedTillNowCentHeader', 'savings.savingsAddStartDateHeader', 'savings.savingsAddInfoHeader', 'savings.savingsAddNoticeHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'savingsId', header: 'ID' },
        { field: 'description', header: translations['savings.savingsAddDescriptionHeader'] },
        { field: 'targetCent', header: translations['savings.savingsAddSavingsTargetHeader'] },
        { field: 'stepAmountCent', header: translations['savings.savingsAddStepAmountHeader'] },
        { field: 'savingsFrequency', header: translations['savings.savingsAddFrequencyHeader'] },
        { field: 'savedTillNowCent', header: translations['savings.savingsAddSavedTillNowCentHeader'] },
        { field: 'startDate', header: translations['savings.savingsAddStartDateHeader'] },
        { field: 'info', header: translations['savings.savingsAddInfoHeader'] },
        { field: 'notice', header: translations['savings.savingsAddNoticeHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportColumns = [
        { field: 'savingsId', header: 'ID' },
        { field: 'description', header: translations['savings.savingsAddDescriptionHeader'] },
        { field: 'targetCent', header: translations['savings.savingsAddSavingsTargetHeader'] },
        { field: 'stepAmountCent', header: translations['savings.savingsAddStepAmountHeader'] },
        { field: 'savingsFrequency', header: translations['savings.savingsAddFrequencyHeader'] },
        { field: 'savedTillNowCent', header: translations['savings.savingsAddSavedTillNowCentHeader'] },
        { field: 'startDate', header: translations['savings.savingsAddStartDateHeader'] },
        { field: 'info', header: translations['savings.savingsAddInfoHeader'] },
        { field: 'notice', header: translations['savings.savingsAddNoticeHeader'] },
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadSavingsFrequency();
    this.loadSavings();
    this.loadUserSettings();
  }

  ngAfterViewInit() {
    this.loadDropdownStyle();
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }

  loadDropdownStyle() {
    if (this.frequencyselector) {
      this.frequencyselector.nativeElement.querySelector(".p-dropdown-label").style.fontSize = "20px";
      this.frequencyselector.nativeElement.querySelector(".p-dropdown-label").style.margin = "auto";
    }
  }

  reloadDropdown(event) {
    setTimeout(() => { this.loadDropdownStyle(); }, 100);
    this.loadDropdownStyle();
  }

  /**
   * Load savings and create savings array to display in the table. 
   */
  loadSavings() {
    this.savings = [];

    this.savingsService.getAllSavingsTable().subscribe((data: Savings[]) => {
      data.forEach(
        (savingsItem: Savings) => {
          this.savings.push({ savingsId: savingsItem.savingsId, description: savingsItem.description, targetCent: savingsItem.targetCent / 100, stepAmountCent: savingsItem.stepAmountCent / 100, savingsFrequency: savingsItem.savingsFrequency, savedTillNowCent: savingsItem.savedTillNowCent / 100, lastSavingsUpdateDate: savingsItem.lastSavingsUpdateDate, startDate: savingsItem.startDate, targetCalculatedDate: savingsItem.targetCalculatedDate, notice: savingsItem.notice, attachment: savingsItem.attachment, attachmentPath: savingsItem.attachmentPath, attachmentName: savingsItem.attachmentName, attachmentType: savingsItem.attachmentType });
        });
      this.savingsLength = this.savings.length;
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  /**
   * Create array containing the translation of savings frequencies
   */
  loadSavingsFrequency() {
    this.savingsFrequencyArray = [];
    this.savingsFrequencyTranslations = {};
    this.translateService.get(['savingsFrequency.frequency1', 'savingsFrequency.frequency2', 'savingsFrequency.frequency3', 'savingsFrequency.frequency4']).subscribe(translations => {
      this.savingsFrequencyTranslations[1] = translations['savingsFrequency.frequency1'];
      this.savingsFrequencyTranslations[2] = translations['savingsFrequency.frequency2'];
      this.savingsFrequencyTranslations[3] = translations['savingsFrequency.frequency3'];
      this.savingsFrequencyTranslations[4] = translations['savingsFrequency.frequency4'];
      this.savingsFrequencyArray.push({ frequencyTitle: translations['savingsFrequency.frequency1'], frequencyValue: 1 });
      this.savingsFrequencyArray.push({ frequencyTitle: translations['savingsFrequency.frequency2'], frequencyValue: 2 });
      this.savingsFrequencyArray.push({ frequencyTitle: translations['savingsFrequency.frequency3'], frequencyValue: 3 });
      this.savingsFrequencyArray.push({ frequencyTitle: translations['savingsFrequency.frequency4'], frequencyValue: 4 });
    });
  }

  /**
   * All here needed user settings. Currency.
   */
  loadUserSettings() {
    this.userSettingsService.getUserSettingBySettingsKey("currency").subscribe((userSetting: UserSetting) => {
      this.currency = userSetting.settingValue;
    }, err => {
      console.log(err);
    });
  }

  /**
   * Get Savings Frequency array object by frequency value. Example 1 for Custom.
   * @param savingsFrequencyValue frequency value
   */
  getSavingsFrequencyObject(savingsFrequencyValue) {
    return this.savingsFrequencyArray[parseInt(savingsFrequencyValue) - 1];
  }

  /**
   * Reload savings data
   */
  reloadAllSavingsData() {
    this.loadSavings();
  }

  /**
   * Delete savings item and save deleted savings in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteSavings(id) {
    this.savingsService.deleteSavings(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.savingsDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.savingsDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllSavingsData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.savingsDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.savingsDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.savingsDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.savingsDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedSavings() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.savingsService.restoreDeletedSavings(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllSavingsData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('savingsRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('savingsRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a Savings row item. 
   * @param newValue 
   * @param savingsItem 
   * @param columnName The column / attribute of the savings item that will be updated
   */
  updateSavingsValue(newValue, savingsItem, columnName) {
    if (columnName === "description") {
      this.savingsService.updateSavingsTable(savingsItem.savingsId, newValue, savingsItem.targetCent, savingsItem.stepAmountCent, savingsItem.savingsFrequency, savingsItem.savedTillNowCent, savingsItem.lastSavingsUpdateDate, savingsItem.startDate, savingsItem.targetCalculatedDate, savingsItem.notice, savingsItem.attachment, savingsItem.attachmentPath, savingsItem.attachmentName, savingsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('savingsTableUpdatedError1');
      });
    }
    else if (columnName === "targetCent") {
      this.savingsService.updateSavingsTable(savingsItem.savingsId, savingsItem.description, newValue, savingsItem.stepAmountCent, savingsItem.savingsFrequency, savingsItem.savedTillNowCent, savingsItem.lastSavingsUpdateDate, savingsItem.startDate, savingsItem.targetCalculatedDate, savingsItem.notice, savingsItem.attachment, savingsItem.attachmentPath, savingsItem.attachmentName, savingsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('savingsTableUpdatedError1');
      });
    }
    else if (columnName === "stepAmountCent") {
      this.savingsService.updateSavingsTable(savingsItem.savingsId, savingsItem.description, savingsItem.targetCent, newValue, savingsItem.savingsFrequency, savingsItem.savedTillNowCent, savingsItem.lastSavingsUpdateDate, savingsItem.startDate, savingsItem.targetCalculatedDate, savingsItem.notice, savingsItem.attachment, savingsItem.attachmentPath, savingsItem.attachmentName, savingsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('savingsTableUpdatedError1');
      });
    }
    else if (columnName === "savingsFrequency") {
      this.savingsService.updateSavingsTable(savingsItem.savingsId, savingsItem.description, savingsItem.targetCent, savingsItem.stepAmountCent, newValue, savingsItem.savedTillNowCent, savingsItem.lastSavingsUpdateDate, savingsItem.startDate, savingsItem.targetCalculatedDate, savingsItem.notice, savingsItem.attachment, savingsItem.attachmentPath, savingsItem.attachmentName, savingsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('savingsTableUpdatedError1');
      });
    }
    else if (columnName === "notice") {
      this.savingsService.updateSavingsTable(savingsItem.savingsId, savingsItem.description, savingsItem.targetCent, savingsItem.stepAmountCent, savingsItem.savingsFrequency, savingsItem.savedTillNowCent, savingsItem.lastSavingsUpdateDate, savingsItem.startDate, savingsItem.targetCalculatedDate, newValue, savingsItem.attachment, savingsItem.attachmentPath, savingsItem.attachmentName, savingsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('savingsTableUpdatedError1');
      });
    }
  }

  saveSavings() {
    let targetCentParsed;
    let stepAmountCentParsed;

    if (this.description === null || typeof this.description === undefined || this.description.trim() === "") {
      this.messageCreator.showErrorMessage('savingsAddSavingsError1');
      return;
    }

    if (this.targetCent === null || typeof this.targetCent === undefined || this.targetCent.trim() === "") {
      this.messageCreator.showErrorMessage('savingsAddSavingsError2');
      return;
    }
    targetCentParsed = parseFloat((this.targetCent).replace(",", "."));

    if (this.selectedFrequency === null || typeof this.selectedFrequency === undefined) {
      this.messageCreator.showErrorMessage('savingsAddSavingsError3');
      return;
    }

    if (this.stepAmountCent === null || typeof this.stepAmountCent === undefined || this.stepAmountCent.trim() === "") {
      this.messageCreator.showErrorMessage('savingsAddSavingsError4');
      return;
    }
    stepAmountCentParsed = parseFloat((this.stepAmountCent).replace(",", "."));


    if (typeof this.notice === undefined || this.notice === null) {
      this.notice = "";
    }

    this.savingsService.saveSavings(this.description, targetCentParsed * 100, stepAmountCentParsed * 100, this.selectedFrequency.frequencyValue, stepAmountCentParsed * 100, new Date(), new Date(), new Date(), this.notice, false, "", "", "").subscribe((savedSavings: Savings) => {
      if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
        if (this.attachmentFile.name != null) {
          this.attachmentName = "" + savedSavings.savingsId;
          this.attachmentPath = this.attachmentName + "." + this.attachmentType;
          this.savingsService.addSavingsAttachment(savedSavings.savingsId, this.attachmentType, this.attachmentFile).subscribe(
            () => {
              this.savingsService.updateSavings(savedSavings.savingsId, this.description, this.targetCent, this.stepAmountCent, this.selectedFrequency, this.stepAmountCent, new Date(), new Date(), new Date(), this.notice, true, this.attachmentPath, this.attachmentName, this.attachmentType).subscribe(() => {
                this.reloadAllSavingsData();
              });
            },
            (err) => {
              console.log("ERROR attachment");
              console.log(err);
            });
        }
      } else {
        console.log("NO attachment");
      }
      this.messageCreator.showSuccessMessage('savingsAddSavingsOK1');
      this.reloadAllSavingsData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('savingsAddSavingsError5');
    });
  }

  onSavingsAttachmentUpload(event) {
    const attachmentFiles: FileList = event.target.files;

    if (attachmentFiles != null && attachmentFiles.length > 0) {
      this.attachmentFile = attachmentFiles[0];
      const filenameArray = this.attachmentFile.name.split(".");
      this.attachment = true;
      this.attachmentName = filenameArray[0];
      this.attachmentType = filenameArray[filenameArray.length - 1];
    }
  }


  updateSavingsAttachment() {
    let parsedUpdatedAttachmentId = parseInt(this.updatedAttachmentId);

    if (parsedUpdatedAttachmentId === null || parsedUpdatedAttachmentId === Number.NaN || parsedUpdatedAttachmentId === 0) {
      this.messageCreator.showErrorMessage('savingsUpdatedAttachmentError1');
      return;
    }

    if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
      if (this.attachmentFile.name != null) {
        this.attachmentName = "" + parsedUpdatedAttachmentId;
        this.attachmentPath = this.attachmentName + "." + this.attachmentType;
        this.savingsService.addSavingsAttachment(parsedUpdatedAttachmentId, this.attachmentType, this.attachmentFile).subscribe(
          () => {
            this.messageCreator.showErrorMessage('savingsUpdatedAttachmentOk1');
          },
          (err) => {
            this.messageCreator.showErrorMessage('savingsUpdatedAttachmentError3');
          });
      }
    } else {
      this.messageCreator.showErrorMessage('savingsUpdatedAttachmentError2');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.savings);
        doc.save('savings.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.savings);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "savings");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  /**
   * Recreate original table object
   */
  resetExportTableData() {
    this.loadSavings();
  }

  /**
   * Redirect to the attachment file of savedAttachmentPath
   * @param savedAttachmentPath 
   */
  openAttachment(savedAttachmentPath) {
    this.userService.authenticateWebDav().subscribe(() => {
      window.open(this.apiConfig.baseAttachmentUrl + this.savingsService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    }, (err) => {
      window.open(this.apiConfig.baseAttachmentUrl + this.savingsService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    });
  }

}
