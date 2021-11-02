import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EarningCategory } from 'src/app/earning/model/earning-category.model';
import { EarningTimerange } from 'src/app/earning/model/earning-timerange.model';
import { EarningTable } from 'src/app/earning/model/earning-table.model';
import { faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight, faCalendarCheck, faCheckSquare, faEuroSign, faFolderPlus, faFont, faHistory, faInfo, faPaperclip, faPlus, faPlusCircle, faRetweet, faTable, faTags, faUndo } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/user/user.service';
import { MessageCreator } from 'src/app/util/messageCreator';
import { MessageService } from 'primeng/api';
import { AppLanguageLoaderHelper } from 'src/app/util/languages.config';
import { ApiConfig } from 'src/app/util/api.config';
import { EarningService } from '../earning.service';
import { EarningCategoryService } from '../earning-category.service';
import { TranslateService } from '@ngx-translate/core';
import { EarningTimerangeService } from '../earning-timerange.service';
import { UserSettingsService } from 'src/app/user-settings.service';
import { Earning } from 'src/app/earning/model/earning.model';
import { ExpenseService } from 'src/app/expense/expense.service';
import { UserSetting } from 'src/app/user/model/user-setting.model';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';

@Component({
  selector: 'app-earning-table',
  templateUrl: './earning-table.component.html',
  styleUrls: ['./earning-table.component.scss']
})
export class EarningTableComponent implements OnInit {

  standardTableWidth = 1698;

  readonly deleteCacheStorageId = "app32xExpensesDeleted";

  loading: boolean;
  localeOfUser: string = "en";

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  earnings: EarningTable[];
  earningsLength: number = 0;

  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  years: number[] = [];
  selectedMonth: number;
  selectedYear: number;
  earningsAmountInfo: string = "";

  earningCategories: EarningCategory[];
  earningTimeranges: EarningTimerange[];
  earningCategoryTitles: string[];
  earningTimerangeTitles: string[];
  earningTimerangeTranslations;
  earningTranslationsTimeranges;
  timerangeTranslationArray: string[];

  earningsMonthlySum: number = 0;
  expensesMonthlySum: number = 0;
  surplusMonthlySum: number = 0;
  earningsYearlySum: number = 0;
  expensesYearlySum: number = 0;
  surplusYearlySum: number = 0;
  earningsAverageSum: number = 0;

  displayedDate: Date;
  displayedDateString: string;

  displayUpdateValue: boolean = false;
  updatedEarningValue: string;
  currentlyUpdatingEarning: EarningTable;
  currentlyUpdatingEarningTitle: string = "";

  //Settings
  selectedCurrency: string = "USD";

  //new earning data
  title: string;
  earningCategory: EarningCategory;
  value: String;
  earningTimerange: string;
  earningDate: Date;
  information: string;
  attachment: boolean = false;
  attachmentPath: string;
  attachmentName: string;
  attachmentType: string;
  attachmentFile: any;

  newCategoryName: string;

  //Sets which earnings to display | 0 -> all, 1-> the selected year (default - the current year), 2-> the selected month, year
  displayEarningsSettings = 1;

  editSelectedEarningCategory: EarningCategory;
  updatedEarningCategory: EarningCategory;
  updatedAttachmentId: string;

  faFont = faFont;
  faTags = faTags;
  faHistory = faHistory;
  faCalendarCheck = faCalendarCheck;
  faInfo = faInfo;
  faTable = faTable;
  faPlusCircle = faPlusCircle;
  faCheckSquare = faCheckSquare;
  faEuroSign = faEuroSign;
  faPlus = faPlus;
  faFolderPlus = faFolderPlus;
  faArrowRight = faArrowRight;
  faRetweet = faRetweet;
  faPaperclip = faPaperclip;
  faMoneyBillAlt = faMoneyBillAlt;
  faUndo = faUndo;


  @ViewChild('categoryselector') categoryselector: ElementRef;
  @ViewChild('timerangeselector') timerangeselector: ElementRef;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private userService: UserService, private messageCreator: MessageCreator, private messageService: MessageService, private appLanguageLoaderHelper: AppLanguageLoaderHelper, private apiConfig: ApiConfig, private earningService: EarningService, private earningCategoryService: EarningCategoryService, private earningTimerangeService: EarningTimerangeService, private expenseService: ExpenseService, private translateService: TranslateService, private userSettingsService: UserSettingsService) {
    this.displayedDate = new Date();
    this.displayedDateString = "(" + this.displayedDate.getFullYear() + ")";
  }

  /**
   * Load earnings and table header translations
   */
  ngOnInit(): void {
    this.loading = true;
    this.localeOfUser = this.appLanguageLoaderHelper.userLanguageCode;
    this.translateService.get(['messages.loginLoginFailedError1', 'messages.expenseDeleteOk1', 'messages.expenseDeleteOk1', 'earning.earningTableHeaderTitle', 'earning.earningTableHeaderCategory', 'earning.earningTableHeaderValue', 'earning.earningTableHeaderTimerange', 'earning.earningTableHeaderDate', 'earning.earningTableHeaderInformation']).subscribe(translations => {
      this.tableColumns = [
        { field: 'earningId', header: 'ID' },
        { field: 'title', header: translations['earning.earningTableHeaderTitle'] },
        { field: 'earningCategory', header: translations['earning.earningTableHeaderCategory'] },
        { field: 'centValue', header: translations['earning.earningTableHeaderValue'] },
        { field: 'earningTimerange', header: translations['earning.earningTableHeaderTimerange'] },
        { field: 'earningDate', header: translations['earning.earningTableHeaderDate'] },
        { field: 'information', header: translations['earning.earningTableHeaderInformation'] },
        { field: 'download', header: 'D' }
      ];
      this.exportColumns = [
        { field: 'earningId', header: 'ID' },
        { field: 'title', header: translations['earning.earningTableHeaderTitle'] },
        { field: 'earningCategory', header: translations['earning.earningTableHeaderCategory'] },
        { field: 'centValue', header: translations['earning.earningTableHeaderValue'] },
        { field: 'earningTimerange', header: translations['earning.earningTableHeaderTimerange'] },
        { field: 'earningDate', header: translations['earning.earningTableHeaderDate'] },
        { field: 'information', header: translations['earning.earningTableHeaderInformation'] },
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadUserSettings();
    this.loadEarningCategories();
    this.loadEarningTimeranges();
    this.calculateMonthlyYearlyExpenses();
    this.calculateMonthlyYearlyEarnings();
    this.loadSingleCustomSumsOfMonth();
    this.loadYearsSelectorValues();
    this.loadInputEnterListener();
  }

  ngAfterViewInit() {
    this.loadDropdownStyle();
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }

  /**
   * Submit price update by user enter input
   */
  onUpdatedPriceChange() {
    if (this.displayUpdateValue) {
      let updatepriceInput = document.getElementById("updatedPrice");
      if (updatepriceInput != null) {
        updatepriceInput.addEventListener("keyup", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("updatePriceButton").click();
          }
        });
      }
    }
  }

  /**
   * Create values for years dropdown selector. Containing +/-15 years from the current year. 
   */
  loadYearsSelectorValues() {
    let currentYear = (new Date()).getUTCFullYear();
    for (let i = currentYear - 15; i <= currentYear; i++) {
      this.years.push(i);
    }
    for (let i = currentYear + 1; i >= currentYear + 15; i++) {
      this.years.push(i);
    }
  }

  loadDropdownStyle() {
    if (this.categoryselector) {
      this.categoryselector.nativeElement.querySelector(".p-dropdown-label").style.fontSize = "20px";
      this.categoryselector.nativeElement.querySelector(".p-dropdown-label").style.margin = "auto";
    }
    if (this.timerangeselector) {
      this.timerangeselector.nativeElement.querySelector(".p-dropdown-label").style.fontSize = "20px";
      this.timerangeselector.nativeElement.querySelector(".p-dropdown-label").style.margin = "auto";
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
   * Load earnings all, of a certain year or month. This is setup through the instance variable displayEarningsSettings. 
   */
  loadEarnings() {
    this.earnings = [];
    if (this.displayEarningsSettings === 0) {
      this.displayedDateString = "";
      this.earningService.getAllEarningTable().subscribe((data: Earning[]) => {
        this.setUpEarningTable(data);
      }, err => {
        console.log(err);
        this.loading = false;
      });
    } else if (this.displayEarningsSettings === 1) {
      this.displayedDateString = "(" + this.displayedDate.getFullYear() + ")";
      this.earningService.getEarningsOfCertainYearTable(this.displayedDate.getFullYear()).subscribe((data: Earning[]) => {
        this.setUpEarningTable(data);
      }, err => {
        console.log(err);
        this.loading = false;
      });
    } else if (this.displayEarningsSettings === 2) {
      this.displayedDateString = "(" + (this.displayedDate.getMonth() + 1) + "/" + this.displayedDate.getFullYear() + ")";
      this.earningService.getEarningsOfCertainMonthYearTable(this.displayedDate.getMonth() + 1, this.displayedDate.getFullYear()).subscribe((data: Earning[]) => {
        this.setUpEarningTable(data);
      }, err => {
        console.log(err);
        this.loading = false;
      });
    }
  }

  /**
 * Get loaded data and set up table.
 */
  setUpEarningTable(data: Earning[]) {
    data.forEach(
      (earningItem: Earning) => {
        this.earnings.push({ earningId: earningItem.earningId, title: earningItem.title, centValue: earningItem.centValue / 100, earningCategory: earningItem.earningCategory.categoryTitle, earningTimerange: this.earningTimerangeTranslations[earningItem.earningTimerange.timerangeTitle], earningDate: earningItem.earningDate, information: earningItem.information, attachment: earningItem.attachment, attachmentPath: earningItem.attachmentPath, attachmentName: earningItem.attachmentName, attachmentType: earningItem.attachmentType });
      });
    this.earningsLength = this.earnings.length;
    this.loading = false;
    this.translateService.get(['messages.numberOfAvailableDatasets']).subscribe(translations => {
      this.earningsAmountInfo = (translations['messages.numberOfAvailableDatasets']).replace("#?", this.earnings.length);
    });
  }


  /**
   * Create array for categories. Create array of titles of categories, which is needed for the category update of an earning. 
   */
  loadEarningCategories() {
    this.earningCategoryService.getAllEarningCategory().subscribe((data: EarningCategory[]) => {
      this.earningCategories = data;
      this.earningCategoryTitles = [];
      this.earningCategories.forEach((earningCategoryItem) => {
        this.earningCategoryTitles.push(earningCategoryItem.categoryTitle);
      });
    }, err => {
    });
  }

  /**
   * Create array for timeranges. Create array of titles of timeranges, which is needed for the timerange update of an earning. 
   * Create array of the translated timeranges, that will be used to display the timerange translated to the selected app language. 
   */
  loadEarningTimeranges() {
    this.earningTimerangeService.getAllEarningTimerange().subscribe((data: EarningTimerange[]) => {
      this.earningTimeranges = data;
      this.earningTimerangeTitles = [];
      this.earningTimerangeTranslations = {};
      this.earningTranslationsTimeranges = {};
      this.timerangeTranslationArray = [];
      this.earningTimeranges.forEach((earningTimerangesItem) => {
        this.translateService.get(['earningTimeranges.earningtimerange' + earningTimerangesItem.timerangeId]).subscribe(translations => {
          this.earningTimerangeTranslations[earningTimerangesItem.timerangeTitle] = (translations['earningTimeranges.earningtimerange' + earningTimerangesItem.timerangeId]);
          this.earningTranslationsTimeranges[translations['earningTimeranges.earningtimerange' + earningTimerangesItem.timerangeId]] = (earningTimerangesItem.timerangeTitle);
          this.timerangeTranslationArray.push(translations['earningTimeranges.earningtimerange' + earningTimerangesItem.timerangeId]);
        });
        this.earningTimerangeTitles.push(earningTimerangesItem.timerangeTitle);
      });
      this.loadEarnings();
    }, err => {
    });
  }

  calculateMonthlyYearlyExpenses() {
    this.expenseService.getMonthlyExpensesSum().subscribe((monthlyExpensesCent: number) => {
      this.expensesMonthlySum = (monthlyExpensesCent / 100);
      this.calculateMonthlyYearlySurplus();
    });
    this.expenseService.getYearlyExpensesSum().subscribe((yearlyExpensesCent: number) => {
      this.expensesYearlySum = (yearlyExpensesCent / 100);
      this.calculateMonthlyYearlySurplus();
    });
  }

  calculateMonthlyYearlyEarnings() {
    this.earningService.getMonthlyEarningsSum().subscribe((monthlyEarningsCent: number) => {
      this.earningsMonthlySum = (monthlyEarningsCent / 100);
      this.calculateMonthlyYearlySurplus();
    });
    this.earningService.getYearlyEarningsSum().subscribe((yearlyEarningsCent: number) => {
      this.earningsYearlySum = (yearlyEarningsCent / 100);
      this.calculateMonthlyYearlySurplus();
    });
  }

  /**
   * Calculate the difference of the sum of earnings and expenses. Run this after calculateMonthlyYearlyExpenses(), calculateMonthlyYearlyEarnings().
   */
  calculateMonthlyYearlySurplus() {
    this.surplusMonthlySum = this.earningsMonthlySum - this.expensesMonthlySum;
    this.surplusYearlySum = this.earningsYearlySum - this.expensesYearlySum;
  }


  /**
   * Load average sum for the selected month
   */
  loadSingleCustomSumsOfMonth() {
    this.earningService.getOfCertainMonthSingleAndCustomEarningsSum(this.displayedDate.getMonth() + 1).subscribe((data: number) => {
      return this.earningsAverageSum = (data / 100);
    }, (err) => {
      return -1;
    });
  }

  /**
   * All here needed user settings. 
   */
  loadUserSettings() {
    this.userSettingsService.getUserSettingBySettingsKey("currency").subscribe((userSetting: UserSetting) => {
      this.selectedCurrency = userSetting.settingValue;
    }, err => {
      console.log(err);
    });
  }

  /**
   * Load expenses in table, monthly and yearly expenses, expenses parts
   */
  reloadAllEarningsData() {
    this.loadEarnings();
    this.calculateMonthlyYearlyExpenses();
    this.calculateMonthlyYearlyEarnings();
    this.loadSingleCustomSumsOfMonth();
  }

  /**
   * Convert cent value to value with integers and comma (cent) values. Used to display currency value in input value
   * @param centValue 
   */
  convertCentValue(centValue): number {
    return centValue / 100;
  }

  /**
   * Display all earnings
   */
  displayAllEarnings() {
    this.displayEarningsSettings = 0;
    this.loadEarnings();
  }

  /**
   * Display earnings of previous year (-1)
   */
  displayEarningsPreviousYear() {
    this.displayEarningsSettings = 1;
    this.displayedDate.setFullYear(this.displayedDate.getFullYear() - 1);
    this.loadEarnings();
  }


  /**
   * Display earnings of next year (+1)
   */
  displayEarningsNextYear() {
    this.displayEarningsSettings = 1;
    this.displayedDate.setFullYear(this.displayedDate.getFullYear() + 1);
    this.loadEarnings();
  }

  /**
 * Display earnings of previous month of current year (-1)
 */
  displayEarningsPreviousMonth() {
    this.displayEarningsSettings = 2;
    if (this.displayedDate)
      if (this.displayedDate.getMonth() === 0) {
        this.displayedDate.setMonth(11);
        this.displayedDate.setFullYear(this.displayedDate.getFullYear() - 1);
      } else {
        this.displayedDate.setMonth(this.displayedDate.getMonth() - 1);
      }
    this.loadEarnings();
  }


  /**
   * Display earnings of next month of current year (+1)
   */
  displayEarningsNextMonth() {
    this.displayEarningsSettings = 2;
    if (this.displayedDate.getMonth() === 11) {
      this.displayedDate.setMonth(0);
      this.displayedDate.setFullYear(this.displayedDate.getFullYear() + 1);
    } else {
      this.displayedDate.setMonth(this.displayedDate.getMonth() + 1);
    }
    this.loadEarnings();
  }

  /**
   * Display earnings of selected month and selected year (or all earnings if not available).
   * @param selectedMonth 
   */
  selectMonthEarnings(selectedMonth) {
    this.selectedMonth = selectedMonth;
    if (this.selectedMonth === null || this.selectedMonth === 0) {
      this.selectedMonth = (new Date()).getMonth();
      this.displayEarningsSettings = 1;
    } else {
      this.displayEarningsSettings = 2;
      this.displayedDate.setMonth(this.selectedMonth - 1);
    }
    if (this.selectedYear === null) {
      this.selectedYear = (new Date()).getFullYear();
      this.displayEarningsSettings = 0;
    }
    this.loadEarnings();
    this.loadSingleCustomSumsOfMonth();
  }

  /**
   * Display earnings of selected year (or all expenses if not available) and selected month (if available).
   * @param selectedMonth 
   */
  selectYearEarnings(selectedYear) {
    this.selectedYear = selectedYear;
    if (this.selectedMonth === null) {
      this.selectedMonth = (new Date()).getMonth();
      this.displayEarningsSettings = 1;
    } else {
      this.displayEarningsSettings = 2;
      this.displayedDate.setFullYear(this.selectedYear);
    }
    if (this.selectedYear === null) {
      this.selectedYear = (new Date()).getFullYear();
      this.displayEarningsSettings = 0;
    }
    this.loadEarnings();
    this.loadSingleCustomSumsOfMonth();
  }

  /**
   * Delete earning and save deleted earning in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteEarning(id) {
    this.earningService.deleteEarning(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.earningDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.earningDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllEarningsData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.earningDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.earningDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.earningDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.earningDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedEarnings() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.earningService.restoreDeletedEarning(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllEarningsData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('earningRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('earningRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a Earning row item. 
   * @param newValue 
   * @param earningItem 
   * @param columnName The column / attribute of the earning item that will be updated
   */
  updateEarningValue(newValue, earningItem, columnName) {
    //Load objects through the title
    let earningCategoryObject = this.getEarningCategoryByCategoryTitle(earningItem.earningCategory);
    let earningTimerangeObject = this.getEarningTimerangeByTimerangeTitle(this.earningTranslationsTimeranges[earningItem.earningTimerange]);

    if (columnName === "title") {
      this.earningService.updateEarningTable(earningItem.earningId, newValue, earningCategoryObject, earningItem.centValue * 100, earningTimerangeObject, earningItem.earningDate, earningItem.information, earningItem.attachment, earningItem.attachmentPath, earningItem.attachmentName, earningItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('earningsTableUpdatedError1');
      });
    }
    else if (columnName === "category") {
      earningCategoryObject = this.getEarningCategoryByCategoryTitle(newValue);
      this.earningService.updateEarningTable(earningItem.earningId, earningItem.title, earningCategoryObject, earningItem.centValue * 100, earningTimerangeObject, earningItem.earningDate, earningItem.information, earningItem.attachment, earningItem.attachmentPath, earningItem.attachmentName, earningItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('earningItem');
      });
    }
    else if (columnName === "timerange") {
      earningTimerangeObject = this.getEarningTimerangeByTimerangeTitle(this.earningTranslationsTimeranges[newValue]);
      this.earningService.updateEarningTable(earningItem.earningId, earningItem.title, earningCategoryObject, earningItem.centValue * 100, earningTimerangeObject, earningItem.earningDate, earningItem.information, earningItem.attachment, earningItem.attachmentPath, earningItem.attachmentName, earningItem.attachmentType).subscribe((res: String) => {
        this.reloadAllEarningsData();
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('earningsTableUpdatedError1');
      });
    }
    else if (columnName === "earningDate") {
      this.earningService.updateEarningTable(earningItem.earningId, earningItem.title, earningCategoryObject, earningItem.centValue * 100, earningTimerangeObject, newValue, earningItem.information, earningItem.attachment, earningItem.attachmentPath, earningItem.attachmentName, earningItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('earningsTableUpdatedError1');
      })
    }
    else if (columnName === "information") {
      this.earningService.updateEarningTable(earningItem.earningId, earningItem.title, earningCategoryObject, earningItem.centValue * 100, earningTimerangeObject, earningItem.earningDate, newValue, earningItem.attachment, earningItem.attachmentPath, earningItem.attachmentName, earningItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('earningsTableUpdatedError1');
      });
    }
  }

  getEarningCategoryByCategoryTitle(earningCategoryTitle) {
    return this.earningCategories.map(earningCategoryItem => {
      if (earningCategoryItem.categoryTitle === earningCategoryTitle) {
        return earningCategoryItem;
      }
    }).filter(selectedEarningCategory => { return selectedEarningCategory })[0];
  }


  getEarningTimerangeByTimerangeTitle(timerangeTitle) {
    let selectedEarningTimerange;

    this.earningTimeranges.forEach(earningTimerangesItem => {
      if (earningTimerangesItem.timerangeTitle == timerangeTitle) {
        selectedEarningTimerange = earningTimerangesItem;
      }
    });
    return selectedEarningTimerange;
  }

  showUpdateValueDialog(updatedEarning: EarningTable) {
    this.currentlyUpdatingEarning = updatedEarning;
    this.currentlyUpdatingEarningTitle = this.currentlyUpdatingEarning.title;

    this.updatedEarningValue = "" + (updatedEarning.centValue);
    this.displayUpdateValue = true;
  }

  saveUpdateValueDialog() {
    let parsedValue = parseFloat(this.updatedEarningValue.replace(",", "."));

    if (parsedValue === NaN || parsedValue === null) {
      this.messageCreator.showErrorMessage('earningsTableUpdatedError2');
      return;
    }
    let earningCategoryObject = this.getEarningCategoryByCategoryTitle(this.currentlyUpdatingEarning.earningCategory);
    let earningTimerangeObject = this.getEarningTimerangeByTimerangeTitle(this.earningTranslationsTimeranges[this.currentlyUpdatingEarning.earningTimerange]);

    this.earningService.updateEarningTable(this.currentlyUpdatingEarning.earningId, this.currentlyUpdatingEarning.title, earningCategoryObject, parsedValue * 100, earningTimerangeObject, this.currentlyUpdatingEarning.earningDate, this.currentlyUpdatingEarning.information, this.currentlyUpdatingEarning.attachment, this.currentlyUpdatingEarning.attachmentPath, this.currentlyUpdatingEarning.attachmentName, this.currentlyUpdatingEarning.attachmentType).subscribe((res: String) => {
      this.reloadAllEarningsData();
    }, err => {
      console.log("UPDATE FAILED!");
      console.log(err);
      this.messageCreator.showErrorMessage('earningsTableUpdatedError1');
    });

    this.displayUpdateValue = false;
  }

  cancelUpdateValueDialog() {
    this.displayUpdateValue = false;
  }

  saveEarning() {
    if (this.value === undefined || this.value.trim() == undefined) {
      this.messageCreator.showErrorMessage('earningAddEarningError1');
      return;
    }

    let valueParsed;
    let centValue;
    valueParsed = parseFloat(((this.value).replace(",", ".")));
    centValue = valueParsed * 100;
    if (valueParsed === Number.NaN) {
      this.messageCreator.showErrorMessage('earningAddEarningError1');
      return;
    }

    if (this.title === null || typeof this.title === undefined || this.title.trim() === "") {
      this.messageCreator.showErrorMessage('earningAddEarningError4');
      return;
    }

    if (this.earningDate === undefined || this.earningDate === null) {
      this.earningDate = new Date();
    }

    if (typeof this.earningCategory == undefined || this.earningCategory === null || typeof this.earningTimerange == undefined || this.earningTimerange === null) {
      this.messageCreator.showErrorMessage('earningAddEarningError5');
      return;
    }

    if (typeof this.information === undefined || this.information === null) {
      this.information = "";
    }
    let earningTimerangeObject  = this.getEarningTimerangeByTimerangeTitle(this.earningTranslationsTimeranges[this.earningTimerange]);


    this.earningService.saveEarning(this.title, this.earningCategory, centValue, earningTimerangeObject, (new Date()).setDate(this.earningDate.getDate() + 1), this.information, false, "", "", "").subscribe((savedEarning: Earning) => {
      if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
        if (this.attachmentFile.name != null) {
          this.attachmentName = "" + savedEarning.earningId;
          this.attachmentPath = this.attachmentName + "." + this.attachmentType;
          this.earningService.addEarningAttachment(savedEarning.earningId, this.attachmentType, this.attachmentFile).subscribe(
            () => {
              this.earningService.updateEarning(savedEarning.earningId, savedEarning.title, savedEarning.earningCategory, savedEarning.centValue, savedEarning.earningTimerange, savedEarning.earningDate, savedEarning.information, true, this.attachmentPath, this.attachmentName, this.attachmentType).subscribe(() => {
                this.reloadAllEarningsData();
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
      this.messageCreator.showSuccessMessage('earningAddEarningAdded1');
      this.reloadAllEarningsData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('earningAddEarningError2');
    });
  }

  addEarningCategory() {
    if (this.newCategoryName.trim() !== "") {
      this.earningCategoryService.saveEarningCategory(this.newCategoryName).subscribe(
        (savedEarningCategory: EarningCategory) => {
          this.messageCreator.showSuccessMessage('earningsTableAddCategoryOK1');
          this.loadEarningCategories();
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage('earningsTableAddCategoryError1');
          this.loadEarningCategories();
        });
    } else {
      this.messageCreator.showErrorMessage('earningsTableAddCategoryError2');
    }
  }

  onEarningAttachmentUpload(event) {
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
    if (this.editSelectedEarningCategory != null) {
      this.earningService.updateEarningCategoriesOfEarnings(this.editSelectedEarningCategory.earningCategoryId, this.updatedEarningCategory.earningCategoryId).subscribe(
        () => {
          this.loadEarnings();
          this.loadEarningCategories();
          this.messageCreator.showSuccessMessage("earningsEditCategoryOk1");
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage('earningsEditCategoryError2');
        });
    } else {
      this.messageCreator.showErrorMessage('earningsEditCategoryError1');
    }
  }

  updateEarningAttachment() {
    let parsedUpdatedAttachmentId = parseInt(this.updatedAttachmentId);

    if (parsedUpdatedAttachmentId === null || parsedUpdatedAttachmentId === Number.NaN || parsedUpdatedAttachmentId === 0) {
      this.messageCreator.showErrorMessage('earningsupdatedAttachmentError1');
      return;
    }

    if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
      if (this.attachmentFile.name != null) {
        this.attachmentName = "" + parsedUpdatedAttachmentId;
        this.attachmentPath = this.attachmentName + "." + this.attachmentType;
        this.earningService.addEarningAttachment(parsedUpdatedAttachmentId, this.attachmentType, this.attachmentFile).subscribe(
          () => {
            this.messageCreator.showErrorMessage('earningsupdatedAttachmentOk1');
          },
          (err) => {
            this.messageCreator.showErrorMessage('earningsupdatedAttachmentError3');
          });
      }
    } else {
      this.messageCreator.showErrorMessage('earningsupdatedAttachmentError2');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.earnings);
        doc.save('earnings.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.earnings);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "earnings");
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
    this.loadEarnings();
  }

  /**
   * Redirect to the attachment file of savedAttachmentPath
   * @param savedAttachmentPath 
   */
  openAttachment(savedAttachmentPath) {
    this.userService.authenticateWebDav().subscribe(() => {
      window.open(this.apiConfig.baseAttachmentUrl + this.earningService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    }, (err) => {
      window.open(this.apiConfig.baseAttachmentUrl + this.earningService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    });
  }

}
