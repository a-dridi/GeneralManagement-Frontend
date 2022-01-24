import { Component, OnInit } from '@angular/core';
import { faTable, faPaperclip, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { OrganizationCategory } from 'src/app/organization/model/organization-category.model';
import { Organization } from 'src/app/organization/model/organization.model';
import { UserSettingsService } from 'src/app/user-settings.service';
import { UserSetting } from 'src/app/user/model/user-setting.model';
import { UserService } from 'src/app/user/user.service';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { AppLanguageLoaderHelper } from 'src/app/util/languages.config';
import { MessageCreator } from 'src/app/util/messageCreator';
import { WealthMonthly } from '../model/wealth-monthly.model';
import { WealthMonthlyService } from '../wealth-monthly.service';

@Component({
  selector: 'app-wealth-monthly',
  templateUrl: './wealth-monthly.component.html',
  styleUrls: ['./wealth-monthly.component.scss']
})
export class WealthMonthlyComponent implements OnInit {
  //Settings
  selectedCurrency: string = "USD";

  localeOfUser: string = "en";

  standardTableWidth = 1350;
  loading: boolean = true;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  wealthmonthlyItems: WealthMonthly[];

  attachment: boolean = false;
  attachmentPath: string;
  attachmentName: string;
  attachmentType: string;
  attachmentFile: any;

  updatedAttachmentId: string;

  faTable = faTable;
  faPaperclip = faPaperclip;
  faRetweet = faRetweet;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private userService: UserService, private messageCreator: MessageCreator, private apiConfig: ApiConfig, private wealthMonthlyService: WealthMonthlyService, private translateService: TranslateService, private userSettingsService: UserSettingsService, private appLanguageLoaderHelper: AppLanguageLoaderHelper) {

  }

  /**
     * Load wealth monthly and table header translations
     */
  ngOnInit(): void {
    this.localeOfUser = this.appLanguageLoaderHelper.userLanguageCode;
    this.loadUserSettings();
    this.translateService.get(['wealthMonthly.wealthMonthlyMonthDateHeader', 'wealthMonthly.wealthMonthlyYearDateHeader', 'wealthMonthly.wealthMonthlyExpenseHeader', 'wealthMonthly.wealthMonthlyEarningHeader', 'wealthMonthly.wealthMonthlyDifferenceHeader', 'wealthMonthly.wealthMonthlyImprovementPctHeader', 'wealthMonthly.wealthNoticeHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'wealthmonthlyId', header: 'ID' },
        { field: 'monthDate', header: translations['wealthMonthly.wealthMonthlyMonthDateHeader'] },
        { field: 'yearDate', header: translations['wealthMonthly.wealthMonthlyYearDateHeader'] },
        { field: 'expenseCent', header: translations['wealthMonthly.wealthMonthlyExpenseHeader'] },
        { field: 'earningCent', header: translations['wealthMonthly.wealthMonthlyEarningHeader'] },
        { field: 'differenceCent', header: translations['wealthMonthly.wealthMonthlyDifferenceHeader'] },
        { field: 'improvementPct', header: translations['wealthMonthly.wealthMonthlyImprovementPctHeader'] },
        { field: 'notice', header: translations['wealthMonthly.wealthNoticeHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportColumns = [
        { field: 'wealthmonthlyId', header: 'ID' },
        { field: 'monthDate', header: translations['wealthMonthly.wealthMonthlyMonthDateHeader'] },
        { field: 'yearDate', header: translations['wealthMonthly.wealthMonthlyYearDateHeader'] },
        { field: 'expenseCent', header: translations['wealthMonthly.wealthMonthlyExpenseHeader'] },
        { field: 'earningCent', header: translations['wealthMonthly.wealthMonthlyEarningHeader'] },
        { field: 'differenceCent', header: translations['wealthMonthly.wealthMonthlyDifferenceHeader'] },
        { field: 'improvementPct', header: translations['wealthMonthly.wealthMonthlyImprovementPctHeader'] },
        { field: 'notice', header: translations['wealthMonthly.wealthNoticeHeader'] },
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadMonthlyWealthItems();
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
   * Load wealth monthly and create wealth monthly array to display in the table. 
   */
  loadMonthlyWealthItems() {
    this.wealthMonthlyService.getAllWealthMonthlyTable().subscribe((data: WealthMonthly[]) => {
      this.wealthmonthlyItems = [];
      data.forEach(
        (wealthMonthlyItem: WealthMonthly) => {
          this.wealthmonthlyItems.push({ wealthmonthlyId: wealthMonthlyItem.wealthmonthlyId, monthDate: wealthMonthlyItem.monthDate, yearDate: wealthMonthlyItem.yearDate, expenseCent: wealthMonthlyItem.expenseCent / 100, earningCent: wealthMonthlyItem.earningCent / 100, differenceCent: wealthMonthlyItem.differenceCent / 100, improvementPct: wealthMonthlyItem.improvementPct, notice: wealthMonthlyItem.notice, attachment: wealthMonthlyItem.attachment, attachmentPath: wealthMonthlyItem.attachmentPath, attachmentName: wealthMonthlyItem.attachmentName, attachmentType: wealthMonthlyItem.attachmentType });
        });
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  /**
   * Reload wealth monthly data
   */
  reloadAllWealthMonthlyData() {
    this.loadMonthlyWealthItems();
  }

  /**
   * Update row value for a Wealth Monthly row item. 
   * @param newValue 
   * @param wealthMonthlyItem 
   * @param columnName The column / attribute of the organization item that will be updated
   */
  updateWealthMonthlyValue(newValue, wealthMonthlyItem, columnName) {
    if (columnName === "expenseCent") {
      let parsedValue = parseFloat(newValue.replace(",", "."));
      if (parsedValue === NaN || parsedValue === null) {
        this.messageCreator.showErrorMessage('wealthMonthlyTableUpdatedError2');
        return;
      }
      this.wealthMonthlyService.updateWealthMonthlyTable(wealthMonthlyItem.wealthmonthlyId, wealthMonthlyItem.monthDate, wealthMonthlyItem.yearDate, parsedValue * 100, wealthMonthlyItem.earningCent * 100, wealthMonthlyItem.differenceCent * 100, wealthMonthlyItem.improvementPct, wealthMonthlyItem.notice, wealthMonthlyItem.attachment, wealthMonthlyItem.attachmentPath, wealthMonthlyItem.attachmentName, wealthMonthlyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('wealthMonthlyTableUpdatedError1');
      });
    }
    else if (columnName === "earningCent") {
      let parsedValue = parseFloat(newValue.replace(",", "."));
      if (parsedValue === NaN || parsedValue === null) {
        this.messageCreator.showErrorMessage('wealthMonthlyTableUpdatedError2');
        return;
      }
      this.wealthMonthlyService.updateWealthMonthlyTable(wealthMonthlyItem.wealthmonthlyId, wealthMonthlyItem.monthDate, wealthMonthlyItem.yearDate, wealthMonthlyItem.expenseCent * 100, newValue * 100, wealthMonthlyItem.differenceCent * 100, wealthMonthlyItem.improvementPct, wealthMonthlyItem.notice, wealthMonthlyItem.attachment, wealthMonthlyItem.attachmentPath, wealthMonthlyItem.attachmentName, wealthMonthlyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('wealthMonthlyTableUpdatedError1');
      });
    }
    else if (columnName === "differenceCent") {
      let parsedValue = parseFloat(newValue.replace(",", "."));
      if (parsedValue === NaN || parsedValue === null) {
        this.messageCreator.showErrorMessage('wealthMonthlyTableUpdatedError2');
        return;
      }
      this.wealthMonthlyService.updateWealthMonthlyTable(wealthMonthlyItem.wealthmonthlyId, wealthMonthlyItem.monthDate, wealthMonthlyItem.yearDate, wealthMonthlyItem.expenseCent * 100, wealthMonthlyItem.earningCent * 100, newValue * 100, wealthMonthlyItem.improvementPct, wealthMonthlyItem.notice, wealthMonthlyItem.attachment, wealthMonthlyItem.attachmentPath, wealthMonthlyItem.attachmentName, wealthMonthlyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('wealthMonthlyTableUpdatedError1');
      });
    }
    else if (columnName === "notice") {
      this.wealthMonthlyService.updateWealthMonthlyTable(wealthMonthlyItem.wealthmonthlyId, wealthMonthlyItem.monthDate, wealthMonthlyItem.yearDate, wealthMonthlyItem.expenseCent * 100, wealthMonthlyItem.earningCent * 100, wealthMonthlyItem.differenceCent * 100, wealthMonthlyItem.improvementPct, newValue, wealthMonthlyItem.attachment, wealthMonthlyItem.attachmentPath, wealthMonthlyItem.attachmentName, wealthMonthlyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('wealthMonthlyTableUpdatedError1');
      });
    }
  }

  updateWealthMonthlyAttachment() {
    let parsedUpdatedAttachmentId = parseInt(this.updatedAttachmentId);

    if (parsedUpdatedAttachmentId === null || parsedUpdatedAttachmentId === Number.NaN || parsedUpdatedAttachmentId === 0) {
      this.messageCreator.showErrorMessage('wealthMonthlyUpdatedAttachmentError1');
      return;
    }

    if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
      if (this.attachmentFile.name != null) {
        this.attachmentName = "" + parsedUpdatedAttachmentId;
        this.attachmentPath = this.attachmentName + "." + this.attachmentType;
        this.wealthMonthlyService.addWealthMonthlyAttachment(parsedUpdatedAttachmentId, this.attachmentType, this.attachmentFile).subscribe(
          () => {
            this.messageCreator.showErrorMessage('wealthMonthlyUpdatedAttachmentOk1');
          },
          (err) => {
            this.messageCreator.showErrorMessage('wealthMonthlyUpdatedAttachmentError3');
          });
      }
    } else {
      this.messageCreator.showErrorMessage('wealthMonthlyUpdatedAttachmentError2');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.wealthmonthlyItems);
        doc.save('wealth_monthly.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.wealthmonthlyItems);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "wealth_monthly");
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
    this.loadMonthlyWealthItems();
  }

  onWealthMonthlyAttachmentUpload(event) {
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
      window.open(this.apiConfig.baseAttachmentUrl + this.wealthMonthlyService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    }, (err) => {
      window.open(this.apiConfig.baseAttachmentUrl + this.wealthMonthlyService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    });
  }

}
