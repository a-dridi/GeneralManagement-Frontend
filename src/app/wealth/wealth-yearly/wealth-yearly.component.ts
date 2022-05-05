import { Component, OnInit } from '@angular/core';
import { faTable, faPaperclip, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { UserSettingsService } from 'src/app/user-settings.service';
import { UserSetting } from 'src/app/user/model/user-setting.model';
import { UserService } from 'src/app/user/user.service';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { AppLanguageLoaderHelper } from 'src/app/util/languages.config';
import { MessageCreator } from 'src/app/util/messageCreator';
import { WealthYearly } from '../model/wealth-yearly.model';
import { WealthYearlyService } from '../wealth-yearly.service';

@Component({
  selector: 'app-wealth-yearly',
  templateUrl: './wealth-yearly.component.html',
  styleUrls: ['./wealth-yearly.component.scss']
})
export class WealthYearlyComponent implements OnInit {
  //Settings
  selectedCurrency: string = "USD";

  localeOfUser: string = "en";
  standardTableWidth = 1203;
  loading: boolean = true;

  tableColumns: any[] = [{ field: 'wealthyearlyId', header: 'ID' }];
  exportColumns: any[] = [];
  exportedColumns: any[] = [];

  wealthyearlyItems: WealthYearly[] = [];

  attachment: boolean = false;
  attachmentPath: string = "";
  attachmentName: string = "";
  attachmentType: string = "";
  attachmentFile: any;

  updatedAttachmentId: string;

  faTable = faTable;
  faPaperclip = faPaperclip;
  faRetweet = faRetweet;


  constructor(private cssStyleAdjustment: CssStyleAdjustment, private userService: UserService, private messageCreator: MessageCreator, private apiConfig: ApiConfig, private wealthYearlyService: WealthYearlyService, private translateService: TranslateService, private userSettingsService: UserSettingsService, private appLanguageLoaderHelper: AppLanguageLoaderHelper) {

  }

  /**
     * Load wealth yearly and table header translations
     */
  ngOnInit(): void {
    this.localeOfUser = this.appLanguageLoaderHelper.userLanguageCode;
    this.loadUserSettings();
    this.translateService.get(['wealthYearly.wealthYearlyMonthDateHeader', 'wealthYearly.wealthYearlyYearDateHeader', 'wealthYearly.wealthYearlyExpenseHeader', 'wealthYearly.wealthYearlyEarningHeader', 'wealthYearly.wealthYearlyDifferenceHeader', 'wealthYearly.wealthYearlyImprovementPctHeader', 'wealthYearly.wealthNoticeHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'wealthyearlyId', header: 'ID' },
        { field: 'yearDate', header: translations['wealthYearly.wealthYearlyYearDateHeader'] },
        { field: 'expenseCent', header: translations['wealthYearly.wealthYearlyExpenseHeader'] },
        { field: 'earningCent', header: translations['wealthYearly.wealthYearlyEarningHeader'] },
        { field: 'differenceCent', header: translations['wealthYearly.wealthYearlyDifferenceHeader'] },
        { field: 'improvementPct', header: translations['wealthYearly.wealthYearlyImprovementPctHeader'] },
        { field: 'notice', header: translations['wealthYearly.wealthNoticeHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportColumns = [
        { field: 'wealthyearlyId', header: 'ID' },
        { field: 'yearDate', header: translations['wealthYearly.wealthYearlyYearDateHeader'] },
        { field: 'expenseCent', header: translations['wealthYearly.wealthYearlyExpenseHeader'] },
        { field: 'earningCent', header: translations['wealthYearly.wealthYearlyEarningHeader'] },
        { field: 'differenceCent', header: translations['wealthYearly.wealthYearlyDifferenceHeader'] },
        { field: 'improvementPct', header: translations['wealthYearly.wealthYearlyImprovementPctHeader'] },
        { field: 'notice', header: translations['wealthYearly.wealthNoticeHeader'] },
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadYearlyWealthItems();
  }

  ngAfterViewInit() {
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }

  loadUserSettings() {
    this.userSettingsService.getUserSettingBySettingsKey("currency").subscribe((userSetting: UserSetting) => {
      this.selectedCurrency = userSetting.settingValue;
    }, err => {
      console.log(err);
    });
  }

  /**
   * Load wealth yearly and create wealth yearly array to display in the table. 
   */
  loadYearlyWealthItems() {
    this.wealthYearlyService.getAllWealthYearlyTable().subscribe((data: WealthYearly[]) => {
      this.wealthyearlyItems = [];
      data.forEach(
        (wealthYearlyItem: WealthYearly) => {
          this.wealthyearlyItems.push({ wealthyearlyId: wealthYearlyItem.wealthyearlyId, yearDate: wealthYearlyItem.yearDate, expenseCent: wealthYearlyItem.expenseCent / 100, earningCent: wealthYearlyItem.earningCent / 100, differenceCent: wealthYearlyItem.differenceCent / 100, improvementPct: wealthYearlyItem.improvementPct, notice: wealthYearlyItem.notice, attachment: wealthYearlyItem.attachment, attachmentPath: wealthYearlyItem.attachmentPath, attachmentName: wealthYearlyItem.attachmentName, attachmentType: wealthYearlyItem.attachmentType });
        });
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  /**
   * Reload wealth yearly data
   */
  reloadAllWealthYearlyData() {
    this.loadYearlyWealthItems();
  }

  /**
   * Update row value for a Wealth Yearly row item. 
   * @param newValue 
   * @param wealthYearlyItem 
   * @param columnName The column / attribute of the organization item that will be updated
   */
  updateWealthYearlyValue(newValue, wealthYearlyItem, columnName) {
    if (columnName === "expenseCent") {
      let parsedValue = parseFloat(newValue.replace(",", "."));
      if (parsedValue === NaN || parsedValue === null) {
        this.messageCreator.showErrorMessage('wealthYearlyTableUpdatedError2');
        return;
      }
      this.wealthYearlyService.updateWealthYearlyTable(wealthYearlyItem.wealthyearlyId, wealthYearlyItem.yearDate, parsedValue * 100, wealthYearlyItem.earningCent * 100, wealthYearlyItem.differenceCent * 100, wealthYearlyItem.improvementPct, wealthYearlyItem.notice, wealthYearlyItem.attachment, wealthYearlyItem.attachmentPath, wealthYearlyItem.attachmentName, wealthYearlyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('wealthYearlyTableUpdatedError1');
      });
    }
    else if (columnName === "earningCent") {
      let parsedValue = parseFloat(newValue.replace(",", "."));
      if (parsedValue === NaN || parsedValue === null) {
        this.messageCreator.showErrorMessage('wealthYearlyTableUpdatedError2');
        return;
      }
      this.wealthYearlyService.updateWealthYearlyTable(wealthYearlyItem.wealthyearlyId, wealthYearlyItem.yearDate, wealthYearlyItem.expenseCent * 100, newValue * 100, wealthYearlyItem.differenceCent * 100, wealthYearlyItem.improvementPct, wealthYearlyItem.notice, wealthYearlyItem.attachment, wealthYearlyItem.attachmentPath, wealthYearlyItem.attachmentName, wealthYearlyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('wealthYearlyTableUpdatedError1');
      });
    }
    else if (columnName === "differenceCent") {
      let parsedValue = parseFloat(newValue.replace(",", "."));
      if (parsedValue === NaN || parsedValue === null) {
        this.messageCreator.showErrorMessage('wealthYearlyTableUpdatedError2');
        return;
      }
      this.wealthYearlyService.updateWealthYearlyTable(wealthYearlyItem.wealthyearlyId, wealthYearlyItem.yearDate, wealthYearlyItem.expenseCent * 100, wealthYearlyItem.earningCent * 100, newValue * 100, wealthYearlyItem.improvementPct, wealthYearlyItem.notice, wealthYearlyItem.attachment, wealthYearlyItem.attachmentPath, wealthYearlyItem.attachmentName, wealthYearlyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('wealthYearlyTableUpdatedError1');
      });
    }
    else if (columnName === "notice") {
      this.wealthYearlyService.updateWealthYearlyTable(wealthYearlyItem.wealthyearlyId, wealthYearlyItem.yearDate, wealthYearlyItem.expenseCent * 100, wealthYearlyItem.earningCent * 100, wealthYearlyItem.differenceCent * 100, wealthYearlyItem.improvementPct, newValue, wealthYearlyItem.attachment, wealthYearlyItem.attachmentPath, wealthYearlyItem.attachmentName, wealthYearlyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('wealthYearlyTableUpdatedError1');
      });
    }
  }

  updateWealthYearlyAttachment() {
    let parsedUpdatedAttachmentId = parseInt(this.updatedAttachmentId);

    if (parsedUpdatedAttachmentId === null || parsedUpdatedAttachmentId === Number.NaN || parsedUpdatedAttachmentId === 0) {
      this.messageCreator.showErrorMessage('wealthYearlyUpdatedAttachmentError1');
      return;
    }

    if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
      if (this.attachmentFile.name != null) {
        this.attachmentName = "" + parsedUpdatedAttachmentId;
        this.attachmentPath = this.attachmentName + "." + this.attachmentType;
        this.wealthYearlyService.addWealthYearlyAttachment(parsedUpdatedAttachmentId, this.attachmentType, this.attachmentFile).subscribe(
          () => {
            this.messageCreator.showErrorMessage('wealthYearlyUpdatedAttachmentOk1');
          },
          (err) => {
            this.messageCreator.showErrorMessage('wealthYearlyUpdatedAttachmentError3');
          });
      }
    } else {
      this.messageCreator.showErrorMessage('wealthYearlyUpdatedAttachmentError2');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.wealthyearlyItems);
        doc.save('wealth_yearly.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.wealthyearlyItems);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "wealth_yearly");
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
    this.loadYearlyWealthItems();
  }

  onWealthYearlyAttachmentUpload(event) {
    const attachmentFiles: FileList = event.target.files;

    if (attachmentFiles != null && attachmentFiles.length > 0) {
      this.attachmentFile = attachmentFiles[0];
      const filenameArray = this.attachmentFile.name.split(".");
      this.attachment = true;
      this.attachmentName = filenameArray[0];
      this.attachmentType = filenameArray[filenameArray.length - 1];
    }
  }

  /**
   * Redirect to the attachment file of savedAttachmentPath
   * @param savedAttachmentPath 
   */
  openAttachment(savedAttachmentPath) {
    this.userService.authenticateWebDav().subscribe(() => {
      window.open(this.apiConfig.baseAttachmentUrl + this.wealthYearlyService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    }, (err) => {
      window.open(this.apiConfig.baseAttachmentUrl + this.wealthYearlyService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    });
  }

}
