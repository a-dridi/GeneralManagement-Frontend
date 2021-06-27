import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faCreativeCommonsZero } from '@fortawesome/free-brands-svg-icons';
import { faFont, faTags, faInfo, faTable, faPlusCircle, faCheckSquare, faPlus, faFolderPlus, faArrowRight, faRetweet, faPaperclip, faUndo, faSearchLocation, faSignal, faBuilding, faGlobe, faLink } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/user/user.service';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { MessageCreator } from 'src/app/util/messageCreator';
import { SoftwareOs } from '../model/software-os.model';
import { SoftwareTable } from '../model/software-table.model';
import { Software } from '../model/software.model';
import { SoftwareOsService } from '../software-os.service';
import { SoftwareService } from '../software.service';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit {

  standardTableWidth = 1470;

  readonly deleteCacheStorageId = "app32xSoftwareDeleted";

  loading: boolean;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  softwares: SoftwareTable[];

  softwareOsItems: SoftwareOs[];
  softwareOsTitles: string[];

  //new software data
  title: string;
  softwareOs: SoftwareOs;
  manufacturer: String;
  language: string;
  version: string;
  notice: string;
  linkValue: string;
  attachment: boolean = false;
  attachmentPath: string;
  attachmentName: string;
  attachmentType: string;
  attachmentFile: any;

  newSoftwareOsName: string;
  editSelectedSoftwareOs: SoftwareOs;
  updatedSoftwareOs: SoftwareOs;
  updatedAttachmentId: string;

  faFont = faFont;
  faTags = faTags;
  faInfo = faInfo;
  faTable = faTable;
  faPlusCircle = faPlusCircle;
  faCheckSquare = faCheckSquare;
  faPlus = faPlus;
  faFolderPlus = faFolderPlus;
  faArrowRight = faArrowRight;
  faRetweet = faRetweet;
  faPaperclip = faPaperclip;
  faUndo = faUndo;
  faBuilding = faBuilding;
  faGlobe = faGlobe;
  faCreativeCommonsZero=faCreativeCommonsZero;
  faLink = faLink;

  @ViewChild('osselector') osselector: ElementRef;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private userService: UserService, private messageCreator: MessageCreator, private messageService: MessageService, private apiConfig: ApiConfig, private softwareService: SoftwareService, private softwareOsService: SoftwareOsService, private translateService: TranslateService) {

  }

  /**
     * Load softwares and table header translations
     */
  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['software.softwareAddTitleHeader', 'software.softwareAddSoftwareOsHeader', 'software.softwareAddManufacturerHeader', 'software.softwareAddLanguageHeader', 'software.softwareAddVersionHeader', 'software.softwareAddNoticeHeader', 'software.softwareAddLinkValueHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'softwareId', header: 'ID' },
        { field: 'title', header: translations['software.softwareAddTitleHeader'] },
        { field: 'softwareOs', header: translations['software.softwareAddSoftwareOsHeader'] },
        { field: 'manufacturer', header: translations['software.softwareAddManufacturerHeader'] },
        { field: 'language', header: translations['software.softwareAddLanguageHeader'] },
        { field: 'version', header: translations['software.softwareAddVersionHeader'] },
        { field: 'notice', header: translations['software.softwareAddNoticeHeader'] },
        { field: 'link', header: translations['software.softwareAddLinkValueHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportColumns = [
        { field: 'softwareId', header: 'ID' },
        { field: 'title', header: translations['software.softwareAddTitleHeader'] },
        { field: 'softwareOs', header: translations['software.softwareAddSoftwareOsHeader'] },
        { field: 'manufacturer', header: translations['software.softwareAddManufacturerHeader'] },
        { field: 'language', header: translations['software.softwareAddLanguageHeader'] },
        { field: 'version', header: translations['software.softwareAddVersionHeader'] },
        { field: 'notice', header: translations['software.softwareAddNoticeHeader'] },
        { field: 'link', header: translations['software.softwareAddLinkValueHeader'] },
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadSoftwareOs();
    this.loadSoftwares();
    this.loadInputEnterListener();
  }

  ngAfterViewInit() {
    this.loadDropdownStyle();
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }

  loadDropdownStyle() {
    if (this.osselector) {
      this.osselector.nativeElement.querySelector(".p-dropdown-label").style.fontSize = "20px";
      this.osselector.nativeElement.querySelector(".p-dropdown-label").style.margin = "auto";
    }
  }

  /**
   * Submit input value when user enters "Enter".
   */
  loadInputEnterListener() {
    //Add category
    let addCategoryInput = document.getElementById("addOsTitle");
    addCategoryInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addOsButton").click();
      }
    });
  }

  reloadDropdown(event) {
    setTimeout(() => { this.loadDropdownStyle(); }, 100);
    this.loadDropdownStyle();
  }

  /**
   * Load softwares and create software array to display in the table. 
   */
  loadSoftwares() {
    this.softwares = [];

    this.softwareService.getAllSoftwareTable().subscribe((data: Software[]) => {
      data.forEach(
        (softwareItem: Software) => {
          this.softwares.push({ softwareId: softwareItem.softwareId, title: softwareItem.title, softwareOs: softwareItem.softwareOs.osTitle, manufacturer: softwareItem.manufacturer, language: softwareItem.language, version: softwareItem.version, notice: softwareItem.notice, linkValue: softwareItem.linkValue, attachment: softwareItem.attachment, attachmentPath: softwareItem.attachmentPath, attachmentName: softwareItem.attachmentName, attachmentType: softwareItem.attachmentType });
        });
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  /**
   * Create array for software os. Create array of titles of software os, which is needed for the operating system (os) update of an software item. 
   */
  loadSoftwareOs() {
    this.softwareOsService.getAllSoftwareOs().subscribe((data: SoftwareOs[]) => {
      this.softwareOsItems = data;
      this.softwareOsTitles = [];
      this.softwareOsItems.forEach((softwareOsItem) => {
        this.softwareOsTitles.push(softwareOsItem.osTitle);
      });
    }, err => {
    });
  }

  /**
   * Reload software data
   */
  reloadAllSoftwareData() {
    this.loadSoftwares();
  }

  /**
   * Delete software item and save deleted software in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteSoftware(id) {
    this.softwareService.deleteSoftware(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.softwareDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.softwareDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllSoftwareData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.softwareDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.softwareDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.softwareDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.softwareDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedSoftwares() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.softwareService.restoreDeletedSoftware(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllSoftwareData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('softwareRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('softwareRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a Software row item. 
   * @param newValue 
   * @param softwareItem 
   * @param columnName The column / attribute of the software item that will be updated
   */
  updateSoftwareValue(newValue, softwareItem, columnName) {
    //Load objects through the title
    let softwareOsObject = this.getSoftwareOsByOsTitle(softwareItem.softwareOs);

    if (columnName === "title") {
      this.softwareService.updateSoftwareTable(softwareItem.softwareId, newValue, softwareOsObject, softwareItem.manufacturer, softwareItem.language, softwareItem.version, softwareItem.notice, softwareItem.linkValue, softwareItem.attachment, softwareItem.attachmentPath, softwareItem.attachmentName, softwareItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('softwareTableUpdatedError1');
      });
    }
    else if (columnName === "softwareOs") {
      softwareOsObject = this.getSoftwareOsByOsTitle(newValue);
      this.softwareService.updateSoftwareTable(softwareItem.softwareId, softwareItem.title, softwareOsObject, softwareItem.manufacturer, softwareItem.language, softwareItem.version, softwareItem.notice, softwareItem.linkValue, softwareItem.attachment, softwareItem.attachmentPath, softwareItem.attachmentName, softwareItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('softwareTableUpdatedError1');
      });
    }
    else if (columnName === "manufacturer") {
      this.softwareService.updateSoftwareTable(softwareItem.softwareId, softwareItem.title, softwareOsObject, newValue, softwareItem.language, softwareItem.version, softwareItem.notice, softwareItem.linkValue, softwareItem.attachment, softwareItem.attachmentPath, softwareItem.attachmentName, softwareItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('softwareTableUpdatedError1');
      });
    }
    else if (columnName === "language") {
      this.softwareService.updateSoftwareTable(softwareItem.softwareId, softwareItem.title, softwareOsObject, softwareItem.manufacturer, newValue, softwareItem.version, softwareItem.notice, softwareItem.linkValue, softwareItem.attachment, softwareItem.attachmentPath, softwareItem.attachmentName, softwareItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('softwareTableUpdatedError1');
      });
    }
    else if (columnName === "version") {
      this.softwareService.updateSoftwareTable(softwareItem.softwareId, softwareItem.title, softwareOsObject, softwareItem.manufacturer, softwareItem.language, newValue, softwareItem.notice, softwareItem.linkValue, softwareItem.attachment, softwareItem.attachmentPath, softwareItem.attachmentName, softwareItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('softwareTableUpdatedError1');
      });
    }
    else if (columnName === "notice") {
      this.softwareService.updateSoftwareTable(softwareItem.softwareId, softwareItem.title, softwareOsObject, softwareItem.manufacturer, softwareItem.language, softwareItem.version, newValue, softwareItem.linkValue, softwareItem.attachment, softwareItem.attachmentPath, softwareItem.attachmentName, softwareItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('softwareTableUpdatedError1');
      });
    }
    else if (columnName === "linkValue") {
      this.softwareService.updateSoftwareTable(softwareItem.softwareId, softwareItem.title, softwareOsObject, softwareItem.manufacturer, softwareItem.language, softwareItem.version, softwareItem.notice, newValue, softwareItem.attachment, softwareItem.attachmentPath, softwareItem.attachmentName, softwareItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('softwareTableUpdatedError1');
      });
    }
  }

  getSoftwareOsByOsTitle(softwareOsTitle) {
    return this.softwareOsItems.map(softwareOsItem => {
      if (softwareOsItem.osTitle === softwareOsTitle) {
        return softwareOsItem;
      }
    }).filter(selectedSoftwareOs => { return selectedSoftwareOs })[0];
  }

  saveSoftware() {
    if (this.title === null || typeof this.title === undefined || this.title.trim() === "") {
      this.messageCreator.showErrorMessage('softwareAddSoftwareError1');
      return;
    }

    if (this.softwareOs === null || typeof this.softwareOs === undefined) {
      this.messageCreator.showErrorMessage('softwareAddSoftwareError2');
      return;
    }

    this.softwareService.saveSoftware(this.title, this.softwareOs, this.manufacturer, this.language, this.version, this.notice, this.linkValue, false, "", "", "").subscribe((savedSoftware: Software) => {
      if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
        if (this.attachmentFile.name != null) {
          this.attachmentName = "" + savedSoftware.softwareId;
          this.attachmentPath = this.attachmentName + "." + this.attachmentType;
          this.softwareService.addSoftwareAttachment(savedSoftware.softwareId, this.attachmentType, this.attachmentFile).subscribe(
            () => {
              this.softwareService.updateSoftware(savedSoftware.softwareId, savedSoftware.title, savedSoftware.softwareOs, savedSoftware.manufacturer, savedSoftware.language, savedSoftware.version, savedSoftware.notice, savedSoftware.linkValue, true, this.attachmentPath, this.attachmentName, this.attachmentType).subscribe(() => {
                this.reloadAllSoftwareData();
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
      this.messageCreator.showSuccessMessage('softwareAddSoftwareOK1');
      this.reloadAllSoftwareData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('softwareAddSoftwareError3');
    });
  }

  addSoftwareOs() {
    if (this.newSoftwareOsName.trim() !== "") {
      this.softwareOsService.saveSoftwareOs(this.newSoftwareOsName).subscribe(
        () => {
          this.messageCreator.showSuccessMessage('softwareAddOsOK1');
          this.loadSoftwareOs();
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage('softwareAddOsError1');
          this.loadSoftwareOs();
        });
    } else {
      this.messageCreator.showErrorMessage('softwareAddOsError2');
    }
  }

  onSoftwareAttachmentUpload(event) {
    const attachmentFiles: FileList = event.target.files;

    if (attachmentFiles != null && attachmentFiles.length > 0) {
      this.attachmentFile = attachmentFiles[0];
      const filenameArray = this.attachmentFile.name.split(".");
      this.attachment = true;
      this.attachmentName = filenameArray[0];
      this.attachmentType = filenameArray[filenameArray.length - 1];
    }
  }

  updateSoftwareOs() {
    if (this.editSelectedSoftwareOs != null) {
      this.softwareService.updateSoftwareOsOfSoftwares(this.editSelectedSoftwareOs.softwareosId, this.updatedSoftwareOs.softwareosId).subscribe(
        () => {
          this.loadSoftwares();
          this.loadSoftwareOs();
          this.messageCreator.showSuccessMessage("softwareEditOsOk1");
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage('softwareEditOsError2');
        });
    } else {
      this.messageCreator.showErrorMessage('softwareEditOsError1');
    }
  }

  updateSoftwareAttachment() {
    let parsedUpdatedAttachmentId = parseInt(this.updatedAttachmentId);

    if (parsedUpdatedAttachmentId === null || parsedUpdatedAttachmentId === Number.NaN || parsedUpdatedAttachmentId === 0) {
      this.messageCreator.showErrorMessage('softwareUpdatedAttachmentError1');
      return;
    }

    if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
      if (this.attachmentFile.name != null) {
        this.attachmentName = "" + parsedUpdatedAttachmentId;
        this.attachmentPath = this.attachmentName + "." + this.attachmentType;
        this.softwareService.addSoftwareAttachment(parsedUpdatedAttachmentId, this.attachmentType, this.attachmentFile).subscribe(
          () => {
            this.messageCreator.showErrorMessage('softwareUpdatedAttachmentOk1');
          },
          (err) => {
            this.messageCreator.showErrorMessage('softwareUpdatedAttachmentError3');
          });
      }
    } else {
      this.messageCreator.showErrorMessage('softwareUpdatedAttachmentError2');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.softwares);
        doc.save('softwares.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.softwares);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "softwares");
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
    this.loadSoftwares();
  }

  /**
   * Redirect to the attachment file of savedAttachmentPath
   * @param savedAttachmentPath 
   */
  openAttachment(savedAttachmentPath) {
    this.userService.authenticateWebDav().subscribe(() => {
      window.open(this.apiConfig.baseAttachmentUrl + this.softwareService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    }, (err) => {
      window.open(this.apiConfig.baseAttachmentUrl + this.softwareService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    });
  }

}
