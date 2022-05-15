import { Component, OnInit } from '@angular/core';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import { faFont, faInfo, faTable, faPlusCircle, faCheckSquare, faPlus, faRetweet, faPaperclip, faUndo, faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import { saveAs } from 'file-saver';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/user/user.service';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { MessageCreator } from 'src/app/util/messageCreator';
import { CryptoCurrencyService } from '../crypto-currency.service';
import { CryptoCurrency } from '../model/crypto-currency.model';

@Component({
  selector: 'app-crypto-currency',
  templateUrl: './crypto-currency.component.html',
  styleUrls: ['./crypto-currency.component.scss']
})
export class CryptoCurrencyComponent implements OnInit {

  standardTableWidth = 1284;

  readonly deleteCacheStorageId = "app32xCryptoCurrencyDeleted";

  loading: boolean;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  cryptocurrencies: CryptoCurrency[];
  cryptocurrenciesLength: number = 0;

  //new cryptocurrency data
  amount: string;
  currency: string;
  storageLocation: string;
  notice: string;
  attachment: boolean = false;
  attachmentPath: string;
  attachmentName: string;
  attachmentType: string;
  attachmentFile: any;

  updatedAttachmentId: string;

  faFont = faFont;
  faBitcoin = faBitcoin;
  faInfo = faInfo;
  faTable = faTable;
  faPlusCircle = faPlusCircle;
  faCheckSquare = faCheckSquare;
  faPlus = faPlus;
  faRetweet = faRetweet;
  faPaperclip = faPaperclip;
  faUndo = faUndo;
  faSearchLocation = faSearchLocation;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private userService: UserService, private messageCreator: MessageCreator, private messageService: MessageService, private apiConfig: ApiConfig, private cryptoCurrencyService: CryptoCurrencyService, private translateService: TranslateService) {

  }

  /**
     * Load organizations and table header translations
     */
  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['cryptocurrency.cryptocurrencyAddAmountHeader', 'cryptocurrency.cryptocurrencyAddCurrencyHeader', 'cryptocurrency.cryptocurrencyAddStorageLocationHeader', 'cryptocurrency.cryptocurrencyAddNoticeHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'cryptocurrencyId', header: 'ID' },
        { field: 'amount', header: translations['cryptocurrency.cryptocurrencyAddAmountHeader'] },
        { field: 'currency', header: translations['cryptocurrency.cryptocurrencyAddCurrencyHeader'] },
        { field: 'storageLocation', header: translations['cryptocurrency.cryptocurrencyAddStorageLocationHeader'] },
        { field: 'notice', header: translations['cryptocurrency.cryptocurrencyAddNoticeHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportColumns = [
        { field: 'cryptocurrencyId', header: 'ID' },
        { field: 'amount', header: translations['cryptocurrency.cryptocurrencyAddAmountHeader'] },
        { field: 'currency', header: translations['cryptocurrency.cryptocurrencyAddCurrencyHeader'] },
        { field: 'storageLocation', header: translations['cryptocurrency.cryptocurrencyAddStorageLocationHeader'] },
        { field: 'notice', header: translations['cryptocurrency.cryptocurrencyAddNoticeHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadCryptoCurrencys();
  }

  ngAfterViewInit() {
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }


  /**
   * Load cryptocurrency and create cryptocurrency array to display in the table. 
   */
  loadCryptoCurrencys() {
    this.cryptoCurrencyService.getAllCryptoCurrencyTable().subscribe((data: CryptoCurrency[]) => {
      this.cryptocurrencies = [];
      data.forEach(
        (cryptocurrencyItem: CryptoCurrency) => {
          this.cryptocurrencies.push({ cryptocurrencyId: cryptocurrencyItem.cryptocurrencyId, amount: cryptocurrencyItem.amount, currency: cryptocurrencyItem.currency, storageLocation: cryptocurrencyItem.storageLocation, notice: cryptocurrencyItem.notice, attachment: cryptocurrencyItem.attachment, attachmentPath: cryptocurrencyItem.attachmentPath, attachmentName: cryptocurrencyItem.attachmentName, attachmentType: cryptocurrencyItem.attachmentType });
        });
      this.cryptocurrenciesLength = this.cryptocurrencies.length;
      this.loading = false;
    }, err => {
      this.cryptocurrencies = [];
      this.cryptocurrenciesLength = 0;
      console.log(err);
      this.loading = false;
    });
  }


  /**
   * Reload crypto currency data
   */
  reloadAllCryptoCurrencyData() {
    this.loadCryptoCurrencys();
  }

  /**
   * Delete crypto currency item and save deleted crypto currency in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteCryptoCurrency(id) {
    this.cryptoCurrencyService.deleteCryptoCurrency(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.cryptocurrencyDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.cryptocurrencyDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllCryptoCurrencyData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.cryptocurrencyDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.cryptocurrencyDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.cryptocurrencyDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.cryptocurrencyDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedCryptoCurrencies() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.cryptoCurrencyService.restoreDeletedCryptoCurrency(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllCryptoCurrencyData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('cryptocurrencyRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('cryptocurrencyRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a CryptoCurrency row item. 
   * @param newValue 
   * @param cryptocurrencyItem 
   * @param columnName The column / attribute of the cryptocurrency item that will be updated
   */
  updateCryptoCurrencyValue(newValue, cryptocurrencyItem, columnName) {
    //Load objects through the title

    if (columnName === "amount") {
      this.cryptoCurrencyService.updateCryptoCurrencyTable(cryptocurrencyItem.cryptocurrencyId, newValue, cryptocurrencyItem.currency, cryptocurrencyItem.storageLocation, cryptocurrencyItem.notice, cryptocurrencyItem.attachment, cryptocurrencyItem.attachmentPath, cryptocurrencyItem.attachmentName, cryptocurrencyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('cryptocurrencyTableUpdatedError1');
      });
    }
    else if (columnName === "currency") {
      this.cryptoCurrencyService.updateCryptoCurrencyTable(cryptocurrencyItem.cryptocurrencyId, cryptocurrencyItem.amount, newValue, cryptocurrencyItem.storageLocation, cryptocurrencyItem.notice, cryptocurrencyItem.attachment, cryptocurrencyItem.attachmentPath, cryptocurrencyItem.attachmentName, cryptocurrencyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('cryptocurrencyTableUpdatedError1');
      });
    }
    else if (columnName === "storageLocation") {
      this.cryptoCurrencyService.updateCryptoCurrencyTable(cryptocurrencyItem.cryptocurrencyId, cryptocurrencyItem.amount, cryptocurrencyItem.currency, newValue, cryptocurrencyItem.notice, cryptocurrencyItem.attachment, cryptocurrencyItem.attachmentPath, cryptocurrencyItem.attachmentName, cryptocurrencyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('cryptocurrencyTableUpdatedError1');
      });
    }
    else if (columnName === "notice") {
      this.cryptoCurrencyService.updateCryptoCurrencyTable(cryptocurrencyItem.cryptocurrencyId, cryptocurrencyItem.amount, cryptocurrencyItem.currency, cryptocurrencyItem.storageLocation, newValue, cryptocurrencyItem.attachment, cryptocurrencyItem.attachmentPath, cryptocurrencyItem.attachmentName, cryptocurrencyItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('organizationsTableUpdatedError1');
      });
    }
  }

  saveCryptoCurrency() {
    let parsedValue = parseFloat(this.amount.replace(",", "."));
    if (parsedValue === NaN || parsedValue === null) {
      this.messageCreator.showErrorMessage('cryptocurrencyAddCryptoCurrencyError1');
      return;
    }

    if (this.currency === null || typeof this.currency === undefined || this.currency.trim() === "") {
      this.messageCreator.showErrorMessage('cryptocurrencyAddCryptoCurrencyError2');
      return;
    }

    if (this.storageLocation === null || typeof this.storageLocation === undefined || this.storageLocation.trim() === "") {
      this.messageCreator.showErrorMessage('cryptocurrencyAddCryptoCurrencyError3');
      return;
    }

    this.cryptoCurrencyService.saveCryptoCurrency(parsedValue, this.currency, this.storageLocation, this.notice, false, "", "", "").subscribe((savedCryptoCurrency: CryptoCurrency) => {
      if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
        if (this.attachmentFile.name != null) {
          this.attachmentName = "" + savedCryptoCurrency.cryptocurrencyId;
          this.attachmentPath = this.attachmentName + "." + this.attachmentType;
          this.cryptoCurrencyService.addCryptoCurrencyAttachment(savedCryptoCurrency.cryptocurrencyId, this.attachmentType, this.attachmentFile).subscribe(
            () => {
              this.cryptoCurrencyService.updateCryptoCurrency(savedCryptoCurrency.cryptocurrencyId, savedCryptoCurrency.amount, savedCryptoCurrency.currency, savedCryptoCurrency.storageLocation, savedCryptoCurrency.notice, true, this.attachmentPath, this.attachmentName, this.attachmentType).subscribe(() => {
                this.reloadAllCryptoCurrencyData();
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
      this.messageCreator.showSuccessMessage('cryptocurrencyAddCryptoCurrencyOK1');
      this.reloadAllCryptoCurrencyData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('cryptocurrencyAddCryptoCurrencyError3');
    });
  }

  onCryptoCurrencyAttachmentUpload(event) {
    const attachmentFiles: FileList = event.target.files;

    if (attachmentFiles != null && attachmentFiles.length > 0) {
      this.attachmentFile = attachmentFiles[0];
      const filenameArray = this.attachmentFile.name.split(".");
      this.attachment = true;
      this.attachmentName = filenameArray[0];
      this.attachmentType = filenameArray[filenameArray.length - 1];
    }
  }

  updateCryptoCurrencyAttachment() {
    let parsedUpdatedAttachmentId = parseInt(this.updatedAttachmentId);

    if (parsedUpdatedAttachmentId === null || parsedUpdatedAttachmentId === Number.NaN || parsedUpdatedAttachmentId === 0) {
      this.messageCreator.showErrorMessage('cryptocurrencyUpdatedAttachmentError1');
      return;
    }

    if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
      if (this.attachmentFile.name != null) {
        this.attachmentName = "" + parsedUpdatedAttachmentId;
        this.attachmentPath = this.attachmentName + "." + this.attachmentType;
        this.cryptoCurrencyService.addCryptoCurrencyAttachment(parsedUpdatedAttachmentId, this.attachmentType, this.attachmentFile).subscribe(
          () => {
            this.messageCreator.showErrorMessage('cryptocurrencyUpdatedAttachmentOk1');
          },
          (err) => {
            this.messageCreator.showErrorMessage('cryptocurrencyUpdatedAttachmentError3');
          });
      }
    } else {
      this.messageCreator.showErrorMessage('cryptocurrencyUpdatedAttachmentError2');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.cryptocurrencies);
        doc.save('crypto_currencies.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.cryptocurrencies);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "crypto_currencies");
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
  reloadTableData() {
    this.loadCryptoCurrencys();
  }

  /**
   * Redirect to the attachment file of savedAttachmentPath
   * @param savedAttachmentPath 
   */
  openAttachment(savedAttachmentPath) {
    this.userService.authenticateWebDav().subscribe(() => {
      window.open(this.apiConfig.baseAttachmentUrl + this.cryptoCurrencyService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    }, (err) => {
      window.open(this.apiConfig.baseAttachmentUrl + this.cryptoCurrencyService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    });
  }


}
