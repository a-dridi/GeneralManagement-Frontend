import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faArrowRight, faCheckSquare, faFolderPlus, faFont, faInfo, faPaperclip, faPlus, faPlusCircle, faRetweet, faSearchLocation, faSignal, faTable, faTags, faUndo } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { OrganizationCategory } from 'src/app/organization/model/organization-category.model';
import { OrganizationTable } from 'src/app/organization/model/organization-table.model';
import { Organization } from 'src/app/organization/model/organization.model';
import { UserService } from 'src/app/user/user.service';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { MessageCreator } from 'src/app/util/messageCreator';
import { OrganizationCategoryService } from '../organization-category.service';
import { OrganizationService } from '../organization.service';

@Component({
  selector: 'app-organization-table',
  templateUrl: './organization-table.component.html',
  styleUrls: ['./organization-table.component.scss']
})
export class OrganizationTableComponent implements OnInit {

  standardTableWidth = 1470;

  readonly deleteCacheStorageId = "app32xOrganizationsDeleted";

  loading: boolean;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  organizations: OrganizationTable[];

  organizationCategories: OrganizationCategory[];
  organizationCategoryTitles: string[];

  //new organization data
  description: string;
  organizationCategory: OrganizationCategory;
  location: String;
  status: string;
  information: string;
  attachment: boolean = false;
  attachmentPath: string;
  attachmentName: string;
  attachmentType: string;
  attachmentFile: any;

  newCategoryName: string;
  editSelectedOrganizationCategory: OrganizationCategory;
  updatedOrganizationCategory: OrganizationCategory;
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
  faSearchLocation = faSearchLocation;
  faSignal = faSignal;

  @ViewChild('categoryselector') categoryselector: ElementRef;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private userService: UserService, private messageCreator: MessageCreator, private messageService: MessageService, private apiConfig: ApiConfig, private organizationService: OrganizationService, private organizationCategoryService: OrganizationCategoryService, private translateService: TranslateService) {

  }

  /**
     * Load organizations and table header translations
     */
  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['organization.organizationAddDescriptionHeader', 'organization.organizationAddCategoryHeader', 'organization.organizationAddLocationHeader', 'organization.organizationAddStatusHeader', 'organization.organizationAddInformationHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'organizationId', header: 'ID' },
        { field: 'description', header: translations['organization.organizationAddDescriptionHeader'] },
        { field: 'organizationCategory', header: translations['organization.organizationAddCategoryHeader'] },
        { field: 'location', header: translations['organization.organizationAddLocationHeader'] },
        { field: 'status', header: translations['organization.organizationAddStatusHeader'] },
        { field: 'information', header: translations['organization.organizationAddInformationHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportColumns = [
        { field: 'organizationId', header: 'ID' },
        { field: 'description', header: translations['organization.organizationAddDescriptionHeader'] },
        { field: 'organizationCategory', header: translations['organization.organizationAddCategoryHeader'] },
        { field: 'location', header: translations['organization.organizationAddLocationHeader'] },
        { field: 'status', header: translations['organization.organizationAddStatusHeader'] },
        { field: 'information', header: translations['organization.organizationAddInformationHeader'] },
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadOrganizationCategories();
    this.loadOrganizations();
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
   * Load organizations and create organizations array to display in the table. 
   */
  loadOrganizations() {
    this.organizations = [];

    this.organizationService.getAllOrganizationTable().subscribe((data: Organization[]) => {
      data.forEach(
        (organizationItem: Organization) => {
          this.organizations.push({ organizationId: organizationItem.organizationId, description: organizationItem.description, organizationCategory: organizationItem.organizationCategory.categoryTitle, location: organizationItem.location, status: organizationItem.status, information: organizationItem.information, attachment: organizationItem.attachment, attachmentPath: organizationItem.attachmentPath, attachmentName: organizationItem.attachmentName, attachmentType: organizationItem.attachmentType });
        });
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  /**
   * Create array for categories. Create array of titles of categories, which is needed for the category update of an organization item. 
   */
  loadOrganizationCategories() {
    this.organizationCategoryService.getAllOrganizationCategory().subscribe((data: OrganizationCategory[]) => {
      this.organizationCategories = data;
      this.organizationCategoryTitles = [];
      this.organizationCategories.forEach((organizationCategoryItem) => {
        this.organizationCategoryTitles.push(organizationCategoryItem.categoryTitle);
      });
    }, err => {
    });
  }

  /**
   * Reload organization data
   */
  reloadAllOrganizationData() {
    this.loadOrganizations();
  }

  /**
   * Delete organization item and save deleted organization in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteOrganization(id) {
    this.organizationService.deleteOrganization(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.organizationDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.organizationDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllOrganizationData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.organizationDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.organizationDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.organizationDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.organizationDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedOrganizations() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.organizationService.restoreDeletedOrganization(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllOrganizationData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('organizationRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('organizationRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a Organization row item. 
   * @param newValue 
   * @param organizationItem 
   * @param columnName The column / attribute of the organization item that will be updated
   */
  updateOrganizationValue(newValue, organizationItem, columnName) {
    //Load objects through the title
    let organizationCategoryObject = this.getOrganizationCategoryByCategoryTitle(organizationItem.organizationCategory);

    if (columnName === "description") {
      this.organizationService.updateOrganizationTable(organizationItem.organizationId, newValue, organizationCategoryObject, organizationItem.location, organizationItem.status, organizationItem.information, organizationItem.attachment, organizationItem.attachmentPath, organizationItem.attachmentName, organizationItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('organizationsTableUpdatedError1');
      });
    }
    else if (columnName === "category") {
      organizationCategoryObject = this.getOrganizationCategoryByCategoryTitle(newValue);
      this.organizationService.updateOrganizationTable(organizationItem.organizationId, organizationItem.description, organizationCategoryObject, organizationItem.location, organizationItem.status, organizationItem.information, organizationItem.attachment, organizationItem.attachmentPath, organizationItem.attachmentName, organizationItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('organizationsTableUpdatedError1');
      });
    }
    else if (columnName === "location") {
      this.organizationService.updateOrganizationTable(organizationItem.organizationId, organizationItem.description, organizationCategoryObject, newValue, organizationItem.status, organizationItem.information, organizationItem.attachment, organizationItem.attachmentPath, organizationItem.attachmentName, organizationItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('organizationsTableUpdatedError1');
      });
    }
    else if (columnName === "status") {
      this.organizationService.updateOrganizationTable(organizationItem.organizationId, organizationItem.description, organizationCategoryObject, organizationItem.location, newValue, organizationItem.information, organizationItem.attachment, organizationItem.attachmentPath, organizationItem.attachmentName, organizationItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('organizationsTableUpdatedError1');
      });
    }
    else if (columnName === "information") {
      this.organizationService.updateOrganizationTable(organizationItem.organizationId, organizationItem.description, organizationCategoryObject, organizationItem.location, organizationItem.status, newValue, organizationItem.attachment, organizationItem.attachmentPath, organizationItem.attachmentName, organizationItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('organizationsTableUpdatedError1');
      });
    }
  }

  getOrganizationCategoryByCategoryTitle(organizationCategoryTitle) {
    return this.organizationCategories.map(organizationCategoryItem => {
      if (organizationCategoryItem.categoryTitle === organizationCategoryTitle) {
        return organizationCategoryItem;
      }
    }).filter(selectedOrganizationCategory => { return selectedOrganizationCategory })[0];
  }

  saveOrganization() {
    if (this.description === null || typeof this.description === undefined || this.description.trim() === "") {
      this.messageCreator.showErrorMessage('organizationAddOrganizationError1');
      return;
    }

    if (this.location === null || typeof this.location === undefined || this.location.trim() === "") {
      this.messageCreator.showErrorMessage('organizationAddOrganizationError2');
      return;
    }

    if (typeof this.information === undefined || this.information === null) {
      this.information = "";
    }

    this.organizationService.saveOrganization(this.description, this.organizationCategory, this.location, this.status, this.information, false, "", "", "").subscribe((savedOrganization: Organization) => {
      if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
        if (this.attachmentFile.name != null) {
          this.attachmentName = "" + savedOrganization.organizationId;
          this.attachmentPath = this.attachmentName + "." + this.attachmentType;
          this.organizationService.addOrganizationAttachment(savedOrganization.organizationId, this.attachmentType, this.attachmentFile).subscribe(
            () => {
              this.organizationService.updateOrganization(savedOrganization.organizationId, savedOrganization.description, savedOrganization.organizationCategory, savedOrganization.location, savedOrganization.status, savedOrganization.information, true, this.attachmentPath, this.attachmentName, this.attachmentType).subscribe(() => {
                this.reloadAllOrganizationData();
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
      this.messageCreator.showSuccessMessage('organizationAddOrganizationOK1');
      this.reloadAllOrganizationData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('organizationAddOrganizationError3');
    });
  }

  addOrganizationCategory() {
    if (this.newCategoryName.trim() !== "") {
      this.organizationCategoryService.saveOrganizationCategory(this.newCategoryName).subscribe(
        () => {
          this.messageCreator.showSuccessMessage('organizationsTableAddCategoryOK1');
          this.loadOrganizationCategories();
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage('organizationsTableAddCategoryError1');
          this.loadOrganizationCategories();
        });
    } else {
      this.messageCreator.showErrorMessage('organizationsTableAddCategoryError2');
    }
  }

  onOrganizationAttachmentUpload(event) {
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
    if (this.editSelectedOrganizationCategory != null) {
      this.organizationService.updateOrganizationCategoriesOfOrganizations(this.editSelectedOrganizationCategory.organizationCategoryId, this.updatedOrganizationCategory.organizationCategoryId).subscribe(
        () => {
          this.loadOrganizations();
          this.loadOrganizationCategories();
          this.messageCreator.showSuccessMessage("organizationEditCategoryOk1");
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage('organizationEditCategoryError2');
        });
    } else {
      this.messageCreator.showErrorMessage('organizationEditCategoryError1');
    }
  }

  updateOrganizationAttachment() {
    let parsedUpdatedAttachmentId = parseInt(this.updatedAttachmentId);

    if (parsedUpdatedAttachmentId === null || parsedUpdatedAttachmentId === Number.NaN || parsedUpdatedAttachmentId === 0) {
      this.messageCreator.showErrorMessage('organizationUpdatedAttachmentError1');
      return;
    }

    if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
      if (this.attachmentFile.name != null) {
        this.attachmentName = "" + parsedUpdatedAttachmentId;
        this.attachmentPath = this.attachmentName + "." + this.attachmentType;
        this.organizationService.addOrganizationAttachment(parsedUpdatedAttachmentId, this.attachmentType, this.attachmentFile).subscribe(
          () => {
            this.messageCreator.showErrorMessage('organizationUpdatedAttachmentOk1');
          },
          (err) => {
            this.messageCreator.showErrorMessage('organizationUpdatedAttachmentError3');
          });
      }
    } else {
      this.messageCreator.showErrorMessage('organizationUpdatedAttachmentError2');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.organizations);
        doc.save('organizations.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.organizations);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "organizations");
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
    this.loadOrganizations();
  }

  /**
   * Redirect to the attachment file of savedAttachmentPath
   * @param savedAttachmentPath 
   */
  openAttachment(savedAttachmentPath) {
    this.userService.authenticateWebDav().subscribe(() => {
      window.open(this.apiConfig.baseAttachmentUrl + this.organizationService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    }, (err) => {
      window.open(this.apiConfig.baseAttachmentUrl + this.organizationService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    });
  }


}
