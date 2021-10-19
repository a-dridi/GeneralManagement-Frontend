import { Component, OnInit } from '@angular/core';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import { faFont, faInfo, faTable, faPlusCircle, faCheckSquare, faPlus, faRetweet, faPaperclip, faUndo, faSearchLocation, faSignOutAlt, faLevelDownAlt, faLevelUpAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/user/user.service';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { MessageCreator } from 'src/app/util/messageCreator';
import { CryptoTransactionsService } from '../crypto-transactions.service';
import { CryptoCurrencyTransactions } from '../model/crypto-currency-transactions.model';

@Component({
  selector: 'app-crypto-currency-transactions',
  templateUrl: './crypto-currency-transactions.component.html',
  styleUrls: ['./crypto-currency-transactions.component.scss']
})
export class CryptoCurrencyTransactionsComponent implements OnInit {

  standardTableWidth = 1470;

  readonly deleteCacheStorageId = "app32xCryptoCurrencyTransactionsDeleted";

  loading: boolean;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  cryptocurrencytransactions: CryptoCurrencyTransactions[];
  cryptocurrencytransactionsLength: number = 0;

  //new cryptocurrency data
  senderFrom: string;
  currencyFrom: string;
  destinationTo: string;
  currencyTo: string;
  amount: string;
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
  faSignOutAlt = faSignOutAlt;
  faLevelUpAlt = faLevelUpAlt;
  faSignInAlt = faSignInAlt;
  faLevelDownAlt = faLevelDownAlt;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private userService: UserService, private messageCreator: MessageCreator, private messageService: MessageService, private apiConfig: ApiConfig, private cryptoCurrencyTransactionsService: CryptoTransactionsService, private translateService: TranslateService) {

  }

  /**
     * Load organizations and table header translations
     */
  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['cryptocurrencytransactions.cryptocurrencytransactionsAddSenderFromHeader', 'cryptocurrencytransactions.cryptocurrencytransactionsAddCurrencyFromHeader', 'cryptocurrencytransactions.cryptocurrencytransactionsAddDestinationToHeader', 'cryptocurrencytransactions.cryptocurrencytransactionsAddCurrencyToHeader', 'cryptocurrencytransactions.cryptocurrencytransactionsAddAmountHeader', 'cryptocurrencytransactions.cryptocurrencytransactionsAddStorageLocationHeader', 'cryptocurrencytransactions.cryptocurrencytransactionsAddNoticeHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'cryptocurrencytransactionId', header: 'ID' },
        { field: 'senderFrom', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddSenderFromHeader'] },
        { field: 'currencyFrom', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddCurrencyFromHeader'] },
        { field: 'destinationTo', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddDestinationToHeader'] },
        { field: 'currencyTo', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddCurrencyToHeader'] },
        { field: 'amount', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddAmountHeader'] },
        { field: 'storageLocation', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddStorageLocationHeader'] },
        { field: 'notice', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddNoticeHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportColumns = [
        { field: 'cryptocurrencytransactionId', header: 'ID' },
        { field: 'senderFrom', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddSenderFromHeader'] },
        { field: 'currencyFrom', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddCurrencyFromHeader'] },
        { field: 'destinationTo', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddDestinationToHeader'] },
        { field: 'currencyTo', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddCurrencyToHeader'] },
        { field: 'amount', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddAmountHeader'] },
        { field: 'storageLocation', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddStorageLocationHeader'] },
        { field: 'notice', header: translations['cryptocurrencytransactions.cryptocurrencytransactionsAddNoticeHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadCryptoCurrencyTransactionss();
  }

  ngAfterViewInit() {
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }


  /**
   * Load cryptocurrencytransactions and create cryptocurrencytransactions array to display in the table. 
   */
  loadCryptoCurrencyTransactionss() {
    this.cryptocurrencytransactions = [];

    this.cryptoCurrencyTransactionsService.getAllCryptoCurrencyTransactionsTable().subscribe((data: CryptoCurrencyTransactions[]) => {
      data.forEach(
        (cryptocurrencytransactionsItem: CryptoCurrencyTransactions) => {
          this.cryptocurrencytransactions.push({ cryptocurrencytransactionId: cryptocurrencytransactionsItem.cryptocurrencytransactionId, senderFrom: cryptocurrencytransactionsItem.senderFrom, currencyFrom: cryptocurrencytransactionsItem.currencyFrom, destinationTo: cryptocurrencytransactionsItem.destinationTo, currencyTo: cryptocurrencytransactionsItem.currencyTo, amount: cryptocurrencytransactionsItem.amount, storageLocation: cryptocurrencytransactionsItem.storageLocation, notice: cryptocurrencytransactionsItem.notice, attachment: cryptocurrencytransactionsItem.attachment, attachmentPath: cryptocurrencytransactionsItem.attachmentPath, attachmentName: cryptocurrencytransactionsItem.attachmentName, attachmentType: cryptocurrencytransactionsItem.attachmentType });
        });
      this.cryptocurrencytransactionsLength = this.cryptocurrencytransactions.length;
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }


  /**
   * Reload crypto currency transactions data
   */
  reloadAllCryptoCurrencyTransactionsData() {
    this.loadCryptoCurrencyTransactionss();
  }

  /**
   * Delete crypto currency transaction item and save deleted crypto currency transaction in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteCryptoCurrencyTransactions(id) {
    this.cryptoCurrencyTransactionsService.deleteCryptoCurrencyTransactions(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.cryptocurrencytransactionsDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.cryptocurrencytransactionsDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllCryptoCurrencyTransactionsData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.cryptocurrencytransactionsDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.cryptocurrencytransactionsDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.cryptocurrencytransactionsDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.cryptocurrencytransactionsDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedCryptoCurrencyTransactions() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.cryptoCurrencyTransactionsService.restoreDeletedCryptoCurrencyTransactions(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllCryptoCurrencyTransactionsData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('cryptocurrencytransactionsRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('cryptocurrencytransactionsRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a CryptoCurrencyTransactions row item. 
   * @param newValue 
   * @param cryptocurrencytransactionsItem 
   * @param columnName The column / attribute of the cryptocurrency item that will be updated
   */
  updateCryptoCurrencyTransactionsValue(newValue, cryptocurrencytransactionsItem, columnName) {
    //Load objects through the title

    if (columnName === "senderFrom") {
      this.cryptoCurrencyTransactionsService.updateCryptoCurrencyTransactionsTable(cryptocurrencytransactionsItem.cryptocurrencytransactionId, newValue, cryptocurrencytransactionsItem.currencyFrom, cryptocurrencytransactionsItem.destinationTo, cryptocurrencytransactionsItem.currencyTo, cryptocurrencytransactionsItem.amount, cryptocurrencytransactionsItem.storageLocation, cryptocurrencytransactionsItem.notice, cryptocurrencytransactionsItem.attachment, cryptocurrencytransactionsItem.attachmentPath, cryptocurrencytransactionsItem.attachmentName, cryptocurrencytransactionsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('cryptocurrencytransactionsTableUpdatedError1');
      });
    }
    else if (columnName === "currencyFrom") {
      this.cryptoCurrencyTransactionsService.updateCryptoCurrencyTransactionsTable(cryptocurrencytransactionsItem.cryptocurrencytransactionId, cryptocurrencytransactionsItem.senderFrom, newValue, cryptocurrencytransactionsItem.destinationTo, cryptocurrencytransactionsItem.currencyTo, cryptocurrencytransactionsItem.amount, cryptocurrencytransactionsItem.storageLocation, cryptocurrencytransactionsItem.notice, cryptocurrencytransactionsItem.attachment, cryptocurrencytransactionsItem.attachmentPath, cryptocurrencytransactionsItem.attachmentName, cryptocurrencytransactionsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('cryptocurrencytransactionsTableUpdatedError1');
      });
    }
    else if (columnName === "destinationTo") {
      this.cryptoCurrencyTransactionsService.updateCryptoCurrencyTransactionsTable(cryptocurrencytransactionsItem.cryptocurrencytransactionId, cryptocurrencytransactionsItem.senderFrom, cryptocurrencytransactionsItem.currencyFrom, newValue, cryptocurrencytransactionsItem.currencyTo, cryptocurrencytransactionsItem.amount, cryptocurrencytransactionsItem.storageLocation, cryptocurrencytransactionsItem.notice, cryptocurrencytransactionsItem.attachment, cryptocurrencytransactionsItem.attachmentPath, cryptocurrencytransactionsItem.attachmentName, cryptocurrencytransactionsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('cryptocurrencytransactionsTableUpdatedError1');
      });
    }
    else if (columnName === "currencyTo") {
      this.cryptoCurrencyTransactionsService.updateCryptoCurrencyTransactionsTable(cryptocurrencytransactionsItem.cryptocurrencytransactionId, cryptocurrencytransactionsItem.senderFrom, cryptocurrencytransactionsItem.currencyFrom, cryptocurrencytransactionsItem.destinationTo, newValue, cryptocurrencytransactionsItem.amount, cryptocurrencytransactionsItem.storageLocation, cryptocurrencytransactionsItem.notice, cryptocurrencytransactionsItem.attachment, cryptocurrencytransactionsItem.attachmentPath, cryptocurrencytransactionsItem.attachmentName, cryptocurrencytransactionsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('cryptocurrencytransactionsTableUpdatedError1');
      });
    }
    else if (columnName === "amount") {
      this.cryptoCurrencyTransactionsService.updateCryptoCurrencyTransactionsTable(cryptocurrencytransactionsItem.cryptocurrencytransactionId, cryptocurrencytransactionsItem.senderFrom, cryptocurrencytransactionsItem.currencyFrom, cryptocurrencytransactionsItem.destinationTo, cryptocurrencytransactionsItem.currencyTo, newValue, cryptocurrencytransactionsItem.storageLocation, cryptocurrencytransactionsItem.notice, cryptocurrencytransactionsItem.attachment, cryptocurrencytransactionsItem.attachmentPath, cryptocurrencytransactionsItem.attachmentName, cryptocurrencytransactionsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('cryptocurrencytransactionsTableUpdatedError1');
      });
    }
    else if (columnName === "storageLocation") {
      this.cryptoCurrencyTransactionsService.updateCryptoCurrencyTransactionsTable(cryptocurrencytransactionsItem.cryptocurrencytransactionId, cryptocurrencytransactionsItem.senderFrom, cryptocurrencytransactionsItem.currencyFrom, cryptocurrencytransactionsItem.destinationTo, cryptocurrencytransactionsItem.currencyTo, cryptocurrencytransactionsItem.amount, newValue, cryptocurrencytransactionsItem.notice, cryptocurrencytransactionsItem.attachment, cryptocurrencytransactionsItem.attachmentPath, cryptocurrencytransactionsItem.attachmentName, cryptocurrencytransactionsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('cryptocurrencytransactionsTableUpdatedError1');
      });
    }
    else if (columnName === "notice") {
      this.cryptoCurrencyTransactionsService.updateCryptoCurrencyTransactionsTable(cryptocurrencytransactionsItem.cryptocurrencytransactionId, cryptocurrencytransactionsItem.senderFrom, cryptocurrencytransactionsItem.currencyFrom, cryptocurrencytransactionsItem.destinationTo, cryptocurrencytransactionsItem.currencyTo, cryptocurrencytransactionsItem.amount, cryptocurrencytransactionsItem.storageLocation, newValue, cryptocurrencytransactionsItem.attachment, cryptocurrencytransactionsItem.attachmentPath, cryptocurrencytransactionsItem.attachmentName, cryptocurrencytransactionsItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('cryptocurrencytransactionsTableUpdatedError1');
      });
    }
  }

  saveCryptoCurrencyTransactions() {
    let parsedValue = parseFloat(this.amount.replace(",", "."));
    if (parsedValue === NaN || parsedValue === null) {
      this.messageCreator.showErrorMessage('cryptocurrencytransactionsAddError6');
      return;
    }

    if (this.senderFrom === null || typeof this.senderFrom === undefined || this.senderFrom.trim() === "") {
      this.messageCreator.showErrorMessage('cryptocurrencytransactionsAddError1');
      return;
    }

    if (this.currencyFrom === null || typeof this.currencyFrom === undefined || this.senderFrom.trim() === "") {
      this.messageCreator.showErrorMessage('cryptocurrencytransactionsAddError2');
      return;
    }

    if (this.destinationTo === null || typeof this.destinationTo === undefined || this.destinationTo.trim() === "") {
      this.messageCreator.showErrorMessage('cryptocurrencytransactionsAddError3');
      return;
    }

    if (this.currencyTo === null || typeof this.currencyTo === undefined || this.currencyTo.trim() === "") {
      this.messageCreator.showErrorMessage('cryptocurrencytransactionsAddError4');
      return;
    }

    this.cryptoCurrencyTransactionsService.saveCryptoCurrencyTransactions(this.senderFrom, this.currencyFrom, this.destinationTo, this.currencyTo, this.amount, this.storageLocation, this.notice, false, "", "", "").subscribe((savedCryptoCurrencyTransactions: CryptoCurrencyTransactions) => {
      if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
        if (this.attachmentFile.name != null) {
          this.attachmentName = "" + savedCryptoCurrencyTransactions.cryptocurrencytransactionId;
          this.attachmentPath = this.attachmentName + "." + this.attachmentType;
          this.cryptoCurrencyTransactionsService.addCryptoCurrencyTransactionsAttachment(savedCryptoCurrencyTransactions.cryptocurrencytransactionId, this.attachmentType, this.attachmentFile).subscribe(
            () => {
              this.cryptoCurrencyTransactionsService.updateCryptoCurrencyTransactions(savedCryptoCurrencyTransactions.cryptocurrencytransactionId, savedCryptoCurrencyTransactions.senderFrom, savedCryptoCurrencyTransactions.currencyFrom, savedCryptoCurrencyTransactions.destinationTo, savedCryptoCurrencyTransactions.currencyTo, savedCryptoCurrencyTransactions.amount, savedCryptoCurrencyTransactions.storageLocation, savedCryptoCurrencyTransactions.notice, true, this.attachmentPath, this.attachmentName, this.attachmentType).subscribe(() => {
                this.reloadAllCryptoCurrencyTransactionsData();
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
      this.messageCreator.showSuccessMessage('cryptocurrencytransactionsAddOk1');
      this.reloadAllCryptoCurrencyTransactionsData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('cryptocurrencytransactionsAddError5');
    });
  }

  onCryptoCurrencyTransactionsAttachmentUpload(event) {
    const attachmentFiles: FileList = event.target.files;

    if (attachmentFiles != null && attachmentFiles.length > 0) {
      this.attachmentFile = attachmentFiles[0];
      const filenameArray = this.attachmentFile.name.split(".");
      this.attachment = true;
      this.attachmentName = filenameArray[0];
      this.attachmentType = filenameArray[filenameArray.length - 1];
    }
  }

  updateCryptoCurrencyTransactionsAttachment() {
    let parsedUpdatedAttachmentId = parseInt(this.updatedAttachmentId);

    if (parsedUpdatedAttachmentId === null || parsedUpdatedAttachmentId === Number.NaN || parsedUpdatedAttachmentId === 0) {
      this.messageCreator.showErrorMessage('cryptocurrencytransactionsUpdatedAttachmentError1');
      return;
    }

    if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
      if (this.attachmentFile.name != null) {
        this.attachmentName = "" + parsedUpdatedAttachmentId;
        this.attachmentPath = this.attachmentName + "." + this.attachmentType;
        this.cryptoCurrencyTransactionsService.addCryptoCurrencyTransactionsAttachment(parsedUpdatedAttachmentId, this.attachmentType, this.attachmentFile).subscribe(
          () => {
            this.messageCreator.showErrorMessage('cryptocurrencytransactionsUpdatedAttachmentOk1');
          },
          (err) => {
            this.messageCreator.showErrorMessage('cryptocurrencytransactionsUpdatedAttachmentError3');
          });
      }
    } else {
      this.messageCreator.showErrorMessage('cryptocurrencytransactionsUpdatedAttachmentError2');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.cryptocurrencytransactions);
        doc.save('crypto_currency_transactions.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.cryptocurrencytransactions);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "crypto_currency_transactions");
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
    this.loadCryptoCurrencyTransactionss();
  }

  /**
   * Redirect to the attachment file of savedAttachmentPath
   * @param savedAttachmentPath 
   */
  openAttachment(savedAttachmentPath) {
    this.userService.authenticateWebDav().subscribe(() => {
      window.open(this.apiConfig.baseAttachmentUrl + this.cryptoCurrencyTransactionsService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    }, (err) => {
      window.open(this.apiConfig.baseAttachmentUrl + this.cryptoCurrencyTransactionsService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    });
  }

}
