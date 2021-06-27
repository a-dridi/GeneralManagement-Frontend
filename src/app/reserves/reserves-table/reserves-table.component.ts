import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faDraft2digital } from '@fortawesome/free-brands-svg-icons';
import { faFont, faTags, faInfo, faTable, faPlusCircle, faCheckSquare, faPlus, faFolderPlus, faArrowRight, faRetweet, faPaperclip, faUndo, faSearchLocation, faSignal, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/user/user.service';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { MessageCreator } from 'src/app/util/messageCreator';
import { ReservesCategory } from '../model/reserves-category.model';
import { ReservesTable } from '../model/reserves-table.model';
import { Reserves } from '../model/reserves.model';
import { ReservesCategoryService } from '../reserves-category.service';
import { ReservesTableService } from '../reserves-table.service';

@Component({
  selector: 'app-reserves-table',
  templateUrl: './reserves-table.component.html',
  styleUrls: ['./reserves-table.component.scss']
})
export class ReservesTableComponent implements OnInit {

  standardTableWidth = 1454;

  readonly deleteCacheStorageId = "app32xReservesDeleted";

  loading: boolean;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  reserves: ReservesTable[];

  reservesCategories: ReservesCategory[];
  reservesCategoryTitles: string[];

  //new reserves data
  category: ReservesCategory;
  description: string;
  amount: string;
  currency: string;
  storageLocation: string;
  notice: string;
  attachment: boolean = false;
  attachmentPath: string;
  attachmentName: string;
  attachmentType: string;
  attachmentFile: any;

  newCategoryName: string;
  editSelectedReservesCategory: ReservesCategory;
  updatedReservesCategory: ReservesCategory;
  updatedAttachmentId: string;

  faFont = faFont;
  faTags = faTags;
  faInfo = faInfo;
  faSearchLocation = faSearchLocation;
  faTable = faTable;
  faPlusCircle = faPlusCircle;
  faCheckSquare = faCheckSquare;
  faPlus = faPlus;
  faFolderPlus = faFolderPlus;
  faArrowRight = faArrowRight;
  faRetweet = faRetweet;
  faPaperclip = faPaperclip;
  faUndo = faUndo;
  faDraft2digital = faDraft2digital;
  faMoneyBillAlt = faMoneyBillAlt;
  
  @ViewChild('categoryselector') categoryselector: ElementRef;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private userService: UserService, private messageCreator: MessageCreator, private messageService: MessageService, private apiConfig: ApiConfig, private reservesTableService: ReservesTableService, private reservesCategoryService: ReservesCategoryService, private translateService: TranslateService) {

  }

  /**
     * Load reserves and table header translations
     */
  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['reserves.reservesAddCategoryHeader', 'reserves.reservesAddDescriptionHeader', 'reserves.reservesAddAmountHeader', 'reserves.reservesAddCurrencyHeader', 'reserves.reservesAddStorageLocationHeader','reserves.reservesAddNoticeHeader','reserves.reservesAddCreatedDateHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'reservesId', header: 'ID' },
        { field: 'category', header: translations['reserves.reservesAddCategoryHeader'] },
        { field: 'description', header: translations['reserves.reservesAddDescriptionHeader'] },
        { field: 'amount', header: translations['reserves.reservesAddAmountHeader'] },
        { field: 'currency', header: translations['reserves.reservesAddCurrencyHeader'] },
        { field: 'storageLocation', header: translations['reserves.reservesAddStorageLocationHeader'] },
        { field: 'notice', header: translations['reserves.reservesAddNoticeHeader'] },
        { field: 'date', header: translations['reserves.reservesAddCreatedDateHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportColumns = [
        { field: 'reservesId', header: 'ID' },
        { field: 'category', header: translations['reserves.reservesAddCategoryHeader'] },
        { field: 'description', header: translations['reserves.reservesAddDescriptionHeader'] },
        { field: 'amount', header: translations['reserves.reservesAddAmountHeader'] },
        { field: 'currency', header: translations['reserves.reservesAddCurrencyHeader'] },
        { field: 'storageLocation', header: translations['reserves.reservesAddStorageLocationHeader'] },
        { field: 'notice', header: translations['reserves.reservesAddNoticeHeader'] },
        { field: 'date', header: translations['reserves.reservesAddCreatedDateHeader'] },
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadReservesCategories();
    this.loadReservesItems();
    this.loadInputEnterListener();
  }

  ngAfterViewInit() {
    this.loadDropdownStyle();
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }

  loadDropdownStyle() {
    if (this.categoryselector) {
      this.categoryselector.nativeElement.querySelector(".p-dropdown-label").style.fontSize = "20px";
      this.categoryselector.nativeElement.querySelector(".p-dropdown-label").style.margin = "auto";
    }
  }

  /**
   * Submit input value when user enters "Enter".
   */
  loadInputEnterListener() {
    //Add category
    let addCategoryInput = document.getElementById("addCategoryTitle");
    addCategoryInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addCategoryButton").click();
      }
    });
  }

  reloadDropdown(event) {
    setTimeout(() => { this.loadDropdownStyle(); }, 100);
    this.loadDropdownStyle();
  }

  /**
   * Load reserves and create reserves array to display in the table. 
   */
  loadReservesItems() {
    this.reserves = [];

    this.reservesTableService.getAllReservesTable().subscribe((data: Reserves[]) => {
      data.forEach(
        (reservesItem: Reserves) => {
          this.reserves.push({ reservesId: reservesItem.reservesId, category: reservesItem.category.categoryTitle, description: reservesItem.description, amount: reservesItem.amount, currency: reservesItem.currency, storageLocation: reservesItem.storageLocation, notice: reservesItem.notice, createdDate: reservesItem.createdDate, attachment: reservesItem.attachment, attachmentPath: reservesItem.attachmentPath, attachmentName: reservesItem.attachmentName, attachmentType: reservesItem.attachmentType });
        });
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  /**
   * Create array for categories. Create array of titles of categories, which is needed for the category update of an reserves item. 
   */
  loadReservesCategories() {
    this.reservesCategoryService.getAllReservesCategory().subscribe((data: ReservesCategory[]) => {
      this.reservesCategories = data;
      this.reservesCategoryTitles = [];
      this.reservesCategories.forEach((reservesCategoryItem) => {
        this.reservesCategoryTitles.push(reservesCategoryItem.categoryTitle);
      });
    }, err => {
    });
  }

  /**
   * Reload reserves data
   */
  reloadAllReservesData() {
    this.loadReservesItems();
  }

  /**
   * Delete reserves item and save deleted reserves in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteReserves(id) {
    this.reservesTableService.deleteReserves(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.reservesDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.reservesDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllReservesData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.reservesDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.reservesDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.reservesDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.reservesDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedReservess() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.reservesTableService.restoreDeletedReserves(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllReservesData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('reservesRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('reservesRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a Reserves row item. 
   * @param newValue 
   * @param reservesItem 
   * @param columnName The column / attribute of the reserves item that will be updated
   */
  updateReservesValue(newValue, reservesItem, columnName) {
    //Load objects through the title
    let reservesCategoryObject = this.getReservesCategoryByCategoryTitle(reservesItem.category);

    if (columnName === "category") {
      reservesCategoryObject = this.getReservesCategoryByCategoryTitle(newValue);
      this.reservesTableService.updateReservesTable(reservesItem.reservesId, reservesCategoryObject, reservesItem.description, reservesItem.amount, reservesItem.currency, reservesItem.storageLocation, reservesItem.notice, reservesItem.createdDate, reservesItem.attachment, reservesItem.attachmentPath, reservesItem.attachmentName, reservesItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('reservesTableUpdatedError1');
      });
    }
    else if (columnName === "description") {
      this.reservesTableService.updateReservesTable(reservesItem.reservesId, reservesCategoryObject, newValue, reservesItem.amount, reservesItem.currency, reservesItem.storageLocation, reservesItem.notice, reservesItem.createdDate, reservesItem.attachment, reservesItem.attachmentPath, reservesItem.attachmentName, reservesItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('reservesTableUpdatedError1');
      });
    }
    else if (columnName === "amount") {
      let parsedNewValue = parseFloat(newValue.replace(",", "."))
      this.reservesTableService.updateReservesTable(reservesItem.reservesId, reservesCategoryObject, reservesItem.description, parsedNewValue, reservesItem.currency, reservesItem.storageLocation, reservesItem.notice, reservesItem.createdDate, reservesItem.attachment, reservesItem.attachmentPath, reservesItem.attachmentName, reservesItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('reservesTableUpdatedError1');
      });
    }
    else if (columnName === "currency") {
      this.reservesTableService.updateReservesTable(reservesItem.reservesId, reservesCategoryObject, reservesItem.description, reservesItem.amount, newValue, reservesItem.storageLocation, reservesItem.notice, reservesItem.createdDate, reservesItem.attachment, reservesItem.attachmentPath, reservesItem.attachmentName, reservesItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('reservesTableUpdatedError1');
      });
    }
    else if (columnName === "storageLocation") {
      this.reservesTableService.updateReservesTable(reservesItem.reservesId, reservesCategoryObject, reservesItem.description, reservesItem.amount, reservesItem.currency, newValue, reservesItem.notice, reservesItem.createdDate, reservesItem.attachment, reservesItem.attachmentPath, reservesItem.attachmentName, reservesItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('reservesTableUpdatedError1');
      });
    }
    else if (columnName === "notice") {
      this.reservesTableService.updateReservesTable(reservesItem.reservesId, reservesCategoryObject, reservesItem.description, reservesItem.amount, reservesItem.currency, reservesItem.storageLocation, newValue, reservesItem.createdDate, reservesItem.attachment, reservesItem.attachmentPath, reservesItem.attachmentName, reservesItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('reservesTableUpdatedError1');
      });
    }
  }

  getReservesCategoryByCategoryTitle(reservesCategoryTitle) {
    return this.reservesCategories.map(reservesCategoryItem => {
      if (reservesCategoryItem.categoryTitle === reservesCategoryTitle) {
        return reservesCategoryItem;
      }
    }).filter(selectedReservesCategory => { return selectedReservesCategory })[0];
  }

  saveReserves() {
    if (this.description === null || typeof this.description === undefined || this.description.trim() === "") {
      this.messageCreator.showErrorMessage('reservesAddReservesError1');
      return;
    }

    if (this.category === null || typeof this.category === undefined) {
      this.messageCreator.showErrorMessage('reservesAddReservesError2');
      return;
    }
    let parsedNewValue = parseFloat(this.amount.replace(",", "."))

    this.reservesTableService.saveReserves(this.category, this.description, parsedNewValue, this.currency, this.storageLocation, this.notice, new Date(), false, "", "", "").subscribe((savedReserves: Reserves) => {
      if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
        if (this.attachmentFile.name != null) {
          this.attachmentName = "" + savedReserves.reservesId;
          this.attachmentPath = this.attachmentName + "." + this.attachmentType;
          this.reservesTableService.addReservesAttachment(savedReserves.reservesId, this.attachmentType, this.attachmentFile).subscribe(
            () => {
              this.reservesTableService.updateReserves(savedReserves.reservesId, savedReserves.category, savedReserves.description, savedReserves.amount, savedReserves.currency, savedReserves.storageLocation, savedReserves.notice, savedReserves.createdDate, true, this.attachmentPath, this.attachmentName, this.attachmentType).subscribe(() => {
                this.reloadAllReservesData();
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
      this.messageCreator.showSuccessMessage('reservesAddReservesOK1');
      this.reloadAllReservesData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('reservesAddReservesError3');
    });
  }

  addReservesCategory() {
    if (this.newCategoryName.trim() !== "") {
      this.reservesCategoryService.saveReservesCategory(this.newCategoryName).subscribe(
        () => {
          this.messageCreator.showSuccessMessage('reservesTableAddCategoryOK1');
          this.loadReservesCategories();
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage('reservesTableAddCategoryError1');
          this.loadReservesCategories();
        });
    } else {
      this.messageCreator.showErrorMessage('reservesTableAddCategoryError2');
    }
  }

  onReservesAttachmentUpload(event) {
    const attachmentFiles: FileList = event.target.files;

    if (attachmentFiles != null && attachmentFiles.length > 0) {
      this.attachmentFile = attachmentFiles[0];
      const filenameArray = this.attachmentFile.name.split(".");
      this.attachment = true;
      this.attachmentName = filenameArray[0];
      this.attachmentType = filenameArray[filenameArray.length - 1];
    }
  }

  updateCategories() {
    if (this.editSelectedReservesCategory != null) {
      this.reservesTableService.updateReservesCategoriesOfReserves(this.editSelectedReservesCategory.reservesCategoryId, this.updatedReservesCategory.reservesCategoryId).subscribe(
        () => {
          this.loadReservesItems();
          this.loadReservesCategories();
          this.messageCreator.showSuccessMessage("reservesEditCategoryOk1");
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage('reservesEditCategoryError2');
        });
    } else {
      this.messageCreator.showErrorMessage('reservesEditCategoryError1');
    }
  }

  updateReservesAttachment() {
    let parsedUpdatedAttachmentId = parseInt(this.updatedAttachmentId);

    if (parsedUpdatedAttachmentId === null || parsedUpdatedAttachmentId === Number.NaN || parsedUpdatedAttachmentId === 0) {
      this.messageCreator.showErrorMessage('reservesUpdatedAttachmentError1');
      return;
    }

    if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
      if (this.attachmentFile.name != null) {
        this.attachmentName = "" + parsedUpdatedAttachmentId;
        this.attachmentPath = this.attachmentName + "." + this.attachmentType;
        this.reservesTableService.addReservesAttachment(parsedUpdatedAttachmentId, this.attachmentType, this.attachmentFile).subscribe(
          () => {
            this.messageCreator.showErrorMessage('reservesUpdatedAttachmentOk1');
          },
          (err) => {
            this.messageCreator.showErrorMessage('reservesUpdatedAttachmentError3');
          });
      }
    } else {
      this.messageCreator.showErrorMessage('reservesUpdatedAttachmentError2');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.reserves);
        doc.save('reserves.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.reserves);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "reserves");
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
    this.loadReservesItems();
  }

  /**
   * Redirect to the attachment file of savedAttachmentPath
   * @param savedAttachmentPath 
   */
  openAttachment(savedAttachmentPath) {
    this.userService.authenticateWebDav().subscribe(() => {
      window.open(this.apiConfig.baseAttachmentUrl + this.reservesTableService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    }, (err) => {
      window.open(this.apiConfig.baseAttachmentUrl + this.reservesTableService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    });
  }

}
