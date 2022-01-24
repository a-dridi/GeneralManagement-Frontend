import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { faBookmark, faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight, faBell, faCalculator, faCalendarCheck, faCheckSquare, faEuroSign, faFolderPlus, faFont, faHistory, faInfo, faPaperclip, faPlus, faPlusCircle, faRetweet, faTable, faTags, faUndo, faWallet } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ExpenseCategory } from 'src/app/expense/model/expense-category.model';
import { ExpenseTimerange } from 'src/app/expense/model/expense-timerange.model';
import { Expense } from 'src/app/expense/model/expense.model';
import { ExpenseTable } from 'src/app/expense/model/expense-table.model';
import { UserSetting } from 'src/app/user/model/user-setting.model';
import { UserSettingsService } from 'src/app/user-settings.service';
import { UserService } from 'src/app/user/user.service';
import { ApiConfig } from 'src/app/util/api.config';
import { MessageCreator } from 'src/app/util/messageCreator';
import { ExpenseBudgetService } from '../expense-budget.service';
import { ExpenseService } from '../expense.service';
import { ExpenseCategoryService } from '../expensecategory.services';
import { ExpenseTimerangeService } from '../expensetimerange.services';
import { AppLanguageLoaderHelper } from 'src/app/util/languages.config';
import { EarningService } from 'src/app/earning/earning.service';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { ExpenseReminder } from '../model/expense-reminder.model';
import { ExpenseReminderService } from '../expense-reminder.service';
import { ExpenseReminderExport } from '../model/expense-reminder-export.model';

@Component({
  selector: 'app-expense-table',
  templateUrl: './expense-table.component.html',
  styleUrls: ['./expense-table.component.scss']
})
export class ExpenseTableComponent implements OnInit {

  standardTableWidth = 1478;

  readonly deleteCacheStorageId = "app32xExpensesDeleted";

  loading: boolean = true;
  localeOfUser: string = "en";
  offset;
  browserWidth;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  expenses: ExpenseTable[];
  expensesLength: number = 0;

  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  years: number[] = [];
  selectedMonth: number = null;
  selectedYear: number;
  expensesAmountInfo: string = "";

  expenseCategories: ExpenseCategory[];
  expenseTimeranges: ExpenseTimerange[];
  expenseCategoryTitles: string[];
  expenseTimerangeTitles: string[];

  //Has the original expense timerange string as key and the translated expense timerange string as value. Used to display the translated expense timerange strings. 
  expenseTimerangeTranslations;
  //Has the translated expense timerange string as key and the original expense timerange string as value. 
  expenseTranslationsTimeranges;

  timerangeTranslationArray: string[];

  displayUpdateValue: boolean = false;
  updatedExpenseValue: string;
  currentlyUpdatingExpense: ExpenseTable;
  currentlyUpdatingExpenseTitle: string = "";

  earningsMonthlySum: number = 0;
  expensesMonthlySum: number = 0;
  surplusMonthlySum: number = 0;
  earningsYearlySum: number = 0;
  expensesYearlySum: number = 0;
  surplusYearlySum: number = 0;
  expensesAverageSum: number = 0;

  displayedDate: Date;
  displayedDateString: string;

  //Expense partion for person
  loadedPerson1NameSetting: UserSetting;
  loadedPerson1RatioSetting: UserSetting;
  loadedPerson2NameSetting: UserSetting;
  loadedPerson2RatioSetting: UserSetting;
  selectedPerson1Name: string;
  selectedPerson1Ratio: string;
  selectedPerson2Name: string;
  selectedPerson2Ratio: string;

  person1SumPart: number;
  person2SumPart: number;
  person1Ratio: number = 50;
  person2Ratio: number = 50;

  //Settings
  selectedCurrency: string = "USD";

  //new expense data
  title: string;
  expenseCategory: ExpenseCategory;
  value: string;
  expenseTimerange: string;
  paymentDate: Date;
  information: string;
  isReminding: boolean = false;
  attachment: boolean = false;
  attachmentPath: string;
  attachmentName: string;
  attachmentType: string;
  attachmentFile: any;

  newCategoryName: string;

  //Sets which expenses to display | 0 -> all, 1-> the selected year, 2-> the selected month and year (default - the current month and year)
  displayExpensesSettings = 2;

  editSelectedExpenseCategory: ExpenseCategory;
  updatedExpenseCategory: ExpenseCategory;
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
  faCalculator = faCalculator;
  faWallet = faWallet;
  faBell = faBell;

  expensePartitionTabHeader: string = "";
  expenseReminderTabHeader: string = "";

  showExpenseReminder: boolean = false;
  expensereminders: ExpenseReminder[] = [];
  expenseremindersExport: ExpenseReminderExport[] = [];
  expensereminderLength: number = 0;
  reminderTableColumns: any[];
  reminderTableColumnsExport: any[];
  exportedColumnsReminder: any[];

  @ViewChild('categoryselector') categoryselector: ElementRef;
  @ViewChild('timerangeselector') timerangeselector: ElementRef;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private userService: UserService, private messageCreator: MessageCreator, private messageService: MessageService, private appLanguageLoaderHelper: AppLanguageLoaderHelper, private apiConfig: ApiConfig, private expenseService: ExpenseService, private expenseCategoryService: ExpenseCategoryService, private expenseTimerangeService: ExpenseTimerangeService, private earningService: EarningService, private translateService: TranslateService, private expenseBudgetService: ExpenseBudgetService, private userSettingsService: UserSettingsService, private expenseReminderService: ExpenseReminderService) {
    this.displayedDate = new Date();
    this.displayedDateString = "(" + this.displayedDate.getFullYear() + ")";
    this.selectedYear = this.displayedDate.getFullYear();
    this.selectedMonth = this.displayedDate.getMonth() + 1;
  }

  /**
   * Load expenses and table header translations
   */
  ngOnInit(): void {
    this.loading = true;
    this.localeOfUser = this.appLanguageLoaderHelper.userLanguageCode;
    this.browserWidth = window.innerWidth;
    this.translateService.get(['messages.loginLoginFailedError1', 'messages.expenseDeleteOk1', 'messages.expenseDeleteOk1', 'expense.expenseTableHeaderTitle', 'expense.expenseTableHeaderCategory', 'expense.expenseTableHeaderValue', 'expense.expenseTableHeaderTimerange', 'expense.expenseTableHeaderPaymentdate', 'expense.expenseTableHeaderInformation', 'expense.expensePartitionTabheader', 'expensereminder.tableHeaderExpenseName', 'expensereminder.tableHeaderExpenseDue', 'expensereminder.expenseReminderTabheader', 'expensereminder.tableHeaderExpensePaid']).subscribe(translations => {
      this.tableColumns = [
        { field: 'expenseId', header: 'ID' },
        { field: 'title', header: translations['expense.expenseTableHeaderTitle'] },
        { field: 'expenseCategory', header: translations['expense.expenseTableHeaderCategory'] },
        { field: 'centValue', header: translations['expense.expenseTableHeaderValue'] },
        { field: 'expenseTimerange', header: translations['expense.expenseTableHeaderTimerange'] },
        { field: 'paymentDate', header: translations['expense.expenseTableHeaderPaymentdate'] },
        { field: 'information', header: translations['expense.expenseTableHeaderInformation'] },
        { field: 'download', header: 'D' }
      ];
      this.exportColumns = [
        { field: 'expenseId', header: 'ID' },
        { field: 'title', header: translations['expense.expenseTableHeaderTitle'] },
        { field: 'expenseCategory', header: translations['expense.expenseTableHeaderCategory'] },
        { field: 'centValue', header: translations['expense.expenseTableHeaderValue'] },
        { field: 'expenseTimerange', header: translations['expense.expenseTableHeaderTimerange'] },
        { field: 'paymentDate', header: translations['expense.expenseTableHeaderPaymentdate'] },
        { field: 'information', header: translations['expense.expenseTableHeaderInformation'] }
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));

      this.reminderTableColumns = [
        { field: 'expense', header: translations['expensereminder.tableHeaderExpenseName'] },
        { field: 'dueDate', header: translations['expensereminder.tableHeaderExpenseDue'] }
      ];
      this.reminderTableColumnsExport = [
        { field: 'expense', header: translations['expensereminder.tableHeaderExpenseName'] },
        { field: 'dueDate', header: translations['expensereminder.tableHeaderExpenseDue'] },
        { field: 'payedDate', header: translations['expensereminder.tableHeaderExpensePaid'] }
      ];
      this.exportedColumnsReminder = this.reminderTableColumnsExport.map(column => ({ title: column.header, dataKey: column.field }));


      this.expensePartitionTabHeader = translations['expense.expensePartitionTabheader'];
      this.expenseReminderTabHeader = translations['expensereminder.expenseReminderTabheader'];
    }
    );
    this.offset = new Date().getTimezoneOffset() - 60;
    this.loadUserSettings();
    this.loadExpensePartionSetting();
    this.loadExpenseCategories();
    this.loadExpenseTimeranges();
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
    let currentYear = (new Date()).getFullYear();
    for (let i = currentYear - 15; i <= currentYear; i++) {
      this.years.push(i);
    }
    for (let i = currentYear + 1; i <= currentYear + 10; i++) {
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

  updateMonthYearDropdownSelector() {
    if (this.displayExpensesSettings === 1) {
      this.selectedYear = this.displayedDate.getFullYear();
    } else if (this.displayExpensesSettings === 2) {
      this.selectedYear = this.displayedDate.getFullYear();
      this.selectedMonth = this.displayedDate.getMonth() + 1;
    }
  }

  reloadDropdown(event) {
    setTimeout(() => { this.loadDropdownStyle(); }, 100);
    this.loadDropdownStyle();
  }

  /**
   * Load expenses all, of a certain year or month. This is setup through the instance variable displayExpensesSettings. 
   */
  loadExpenses() {
    this.loading = true;
    if (this.displayExpensesSettings === 0) {
      this.displayedDateString = "";
      this.expenseService.getAllExpenseTable().subscribe((data: Expense[]) => {
        this.setUpExpenseTable(data);
      }, err => {
        console.log(err);
        this.loading = false;
      });
    } else if (this.displayExpensesSettings === 1) {
      this.displayedDateString = "(" + this.displayedDate.getFullYear() + ")";
      this.expenseService.getExpensesOfCertainYearTable(this.displayedDate.getFullYear()).subscribe((data: Expense[]) => {
        this.setUpExpenseTable(data);
      }, err => {
        console.log(err);
        this.loading = false;
      });
    } else if (this.displayExpensesSettings === 2) {
      this.displayedDateString = "(" + (this.displayedDate.getMonth() + 1) + "/" + this.displayedDate.getFullYear() + ")";
      this.expenseService.getExpensesOfCertainMonthYearTable(this.displayedDate.getMonth() + 1, this.displayedDate.getFullYear()).subscribe((data: Expense[]) => {
        this.setUpExpenseTable(data);
      }, err => {
        console.log(err);
        this.loading = false;
      });
    }
  }

  /**
   * Get loaded data and set up table.
   */
  setUpExpenseTable(data: Expense[]) {
    this.expenses = [];
    this.expensereminders = [];
    this.expenseremindersExport = [];
    this.expensereminderLength = 0;

    data.forEach(
      (expenseItem: Expense) => {
        this.expenses.push({ expenseId: expenseItem.expenseId, title: expenseItem.title, centValue: expenseItem.centValue / 100, expenseCategory: expenseItem.expenseCategory.categoryTitle, expenseTimerange: this.expenseTimerangeTranslations[expenseItem.expenseTimerange.timerangeTitle], paymentDate: expenseItem.paymentDate, information: expenseItem.information, isReminding: expenseItem.isReminding, attachment: expenseItem.attachment, attachmentPath: expenseItem.attachmentPath, attachmentName: expenseItem.attachmentName, attachmentType: expenseItem.attachmentType });
        if (expenseItem.isReminding === true) {
          this.expenseReminderService.getExpenseReminderByExpenseId(expenseItem.expenseId).subscribe((expenseReminderItem: ExpenseReminder) => {
            if (expenseReminderItem.dueDate != null) {
              this.setUpExpenseReminder(expenseReminderItem);
            }
          }, err => {
            console.log(err);
          });
        }
      });

    if (this.expensereminders.length > 0) {
      this.showExpenseReminder = true;
      this.expensereminderLength++;
    } else {
      this.showExpenseReminder = false;
    }

    this.expensesLength = this.expenses.length;
    this.loading = false;
    this.translateService.get(['messages.numberOfAvailableDatasets']).subscribe(translations => {
      this.expensesAmountInfo = (translations['messages.numberOfAvailableDatasets']).replace("#?", this.expenses.length);
    });
  }

  /**
   * Create array for categories. Create array of titles of categories, which is needed for the category update of an expense. 
   */
  loadExpenseCategories() {
    this.expenseCategoryService.getAllExpenseCategory().subscribe((data: ExpenseCategory[]) => {
      this.expenseCategories = data;
      this.expenseCategoryTitles = [];
      this.expenseCategories.forEach((expenseCategoryItem) => {
        this.expenseCategoryTitles.push(expenseCategoryItem.categoryTitle);
      });
    }, err => {
    });
  }

  /**
   * Create array for timeranges. Create array of titles of timeranges, which is needed for the timerange update of an expense. 
   * Create array of the translated timeranges, that will be used to display the timerange translated to the selected app language. 
   */
  loadExpenseTimeranges() {
    this.expenseTimerangeService.getAllExpenseTimerange().subscribe((data: ExpenseTimerange[]) => {
      this.expenseTimeranges = data;
      this.expenseTimerangeTitles = [];
      this.expenseTimerangeTranslations = {};
      this.expenseTranslationsTimeranges = {};
      this.timerangeTranslationArray = [];
      this.expenseTimeranges.forEach((expenseTimerangesItem) => {
        this.translateService.get(['expenseTimeranges.expensetimerange' + expenseTimerangesItem.timerangeId]).subscribe(translations => {
          this.expenseTimerangeTranslations[expenseTimerangesItem.timerangeTitle] = (translations['expenseTimeranges.expensetimerange' + expenseTimerangesItem.timerangeId]);
          this.expenseTranslationsTimeranges[translations['expenseTimeranges.expensetimerange' + expenseTimerangesItem.timerangeId]] = (expenseTimerangesItem.timerangeTitle);
          this.timerangeTranslationArray.push(translations['expenseTimeranges.expensetimerange' + expenseTimerangesItem.timerangeId]);
        });
        this.expenseTimerangeTitles.push(expenseTimerangesItem.timerangeTitle);
      });
      this.loadExpenses();
    }, err => {
    });
  }

  /**
   * Add expense reminder that are due. If it's monthly (expense), then due this month, if it's yearly then due this year in 3 months. 
   * Daily expense: Added daily (when the current day is the same as the due date).
   * Weekly expense: Added, when it's due in 3 days. 
   * Bi-Weekly expense: Added, when it's due in 7 days. 
   * Monthly expense: Added, when it's due in 10 days. 
   * Every 2 months expense: Added, when it's due in 10 days. 
   * Every 3 months expense, 6 months, yearly, 2 yearly, 5 years: Added, when it's due in 14 days. 
   * @param expenseReminder 
   */
  setUpExpenseReminder(expenseReminder: ExpenseReminder) {
    let currentDate = new Date();

    switch (expenseReminder.expense.expenseTimerange.timerangeId) {
      case 1:
        if (expenseReminder.payedDate == null) {
          //Expense was now added or it's a single time expense. 
          this.expensereminders.push(expenseReminder);
          this.expenseremindersExport.push({ expensereminderId: expenseReminder.expensereminderId, expense: expenseReminder.expense.title, dueDate: expenseReminder.dueDate, payedDate: expenseReminder.payedDate });
        }
        break;
      case 2:
        if (currentDate.getDay() === expenseReminder.dueDate.getDay()) {
          this.expensereminders.push(expenseReminder);
          this.expenseremindersExport.push({ expensereminderId: expenseReminder.expensereminderId, expense: expenseReminder.expense.title, dueDate: expenseReminder.dueDate, payedDate: expenseReminder.payedDate });
        }
        break;
      case 3:
        if (currentDate.getDay() >= (expenseReminder.dueDate.getDay() - 3) && currentDate.getDay() <= expenseReminder.dueDate.getDay()) {
          this.expensereminders.push(expenseReminder);
          this.expenseremindersExport.push({ expensereminderId: expenseReminder.expensereminderId, expense: expenseReminder.expense.title, dueDate: expenseReminder.dueDate, payedDate: expenseReminder.payedDate });
        }
        break;
      case 4:
        if (currentDate.getDay() >= (expenseReminder.dueDate.getDay() - 10) && currentDate.getDay() <= expenseReminder.dueDate.getDay()) {
          this.expensereminders.push(expenseReminder);
          this.expenseremindersExport.push({ expensereminderId: expenseReminder.expensereminderId, expense: expenseReminder.expense.title, dueDate: expenseReminder.dueDate, payedDate: expenseReminder.payedDate });
        }
        break;
      case 5:
        if (currentDate.getDay() >= (expenseReminder.dueDate.getDay() - 10) && currentDate.getDay() <= expenseReminder.dueDate.getDay()) {
          this.expensereminders.push(expenseReminder);
          this.expenseremindersExport.push({ expensereminderId: expenseReminder.expensereminderId, expense: expenseReminder.expense.title, dueDate: expenseReminder.dueDate, payedDate: expenseReminder.payedDate });
        }
        break;
      case 6:
        if (currentDate.getDay() >= (expenseReminder.dueDate.getDay() - 10) && currentDate.getDay() <= expenseReminder.dueDate.getDay()) {
          this.expensereminders.push(expenseReminder);
          this.expenseremindersExport.push({ expensereminderId: expenseReminder.expensereminderId, expense: expenseReminder.expense.title, dueDate: expenseReminder.dueDate, payedDate: expenseReminder.payedDate });
        }
        break;
      default:
        if (currentDate.getDay() >= (expenseReminder.dueDate.getDay() - 14) && currentDate.getDay() <= expenseReminder.dueDate.getDay()) {
          this.expensereminders.push(expenseReminder);
          this.expenseremindersExport.push({ expensereminderId: expenseReminder.expensereminderId, expense: expenseReminder.expense.title, dueDate: expenseReminder.dueDate, payedDate: expenseReminder.payedDate });
        }
    }

    if (this.expensereminders.length > 0) {
      this.showExpenseReminder = true;
      this.expensereminderLength++;
    } else {
      this.showExpenseReminder = false;
    }
  }

  payExpenseReminder(expenseReminder: ExpenseReminder) {
    this.expenseReminderService.updateExpenseReminderTable(expenseReminder.expensereminderId, expenseReminder.expense.expenseId, expenseReminder.dueDate, new Date()).subscribe(() => {
      this.loadExpenses();
    }, err => {
      console.log(err);
      this.messageCreator.showErrorMessage('expensereminderTableUpdatedError1');
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
      this.displayExpensesPartCalculation();
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
      this.displayExpensesPartCalculation();
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
    this.expenseService.getOfCertainMonthSingleAndCustomExpensesSum(this.displayedDate.getMonth() + 1, this.displayedDate.getFullYear()).subscribe((data: number) => {
      return this.expensesAverageSum = (data / 100);
    }, (err) => {
      return -1;
    });
  }

  /**
   * Load person names and partion ratio
   */
  loadExpensePartionSetting() {
    this.userSettingsService.getUserSettingBySettingsKey("person1Name").subscribe((userSetting: UserSetting) => {
      this.loadedPerson1NameSetting = userSetting;
      this.selectedPerson1Name = userSetting.settingValue;
    });


    this.userSettingsService.getUserSettingBySettingsKey("person1Ratio").subscribe((userSetting: UserSetting) => {
      this.loadedPerson1RatioSetting = userSetting;
      this.selectedPerson1Ratio = userSetting.settingValue;
      this.person1Ratio = parseInt(this.selectedPerson1Ratio);
    });


    this.userSettingsService.getUserSettingBySettingsKey("person2Name").subscribe((userSetting: UserSetting) => {
      this.loadedPerson2NameSetting = userSetting;
      this.selectedPerson2Name = userSetting.settingValue;
    });


    this.userSettingsService.getUserSettingBySettingsKey("person2Ratio").subscribe((userSetting: UserSetting) => {
      this.loadedPerson2RatioSetting = userSetting;
      this.selectedPerson2Ratio = userSetting.settingValue;
      this.person2Ratio = parseInt(this.selectedPerson2Ratio);
    });
  }

  /**
   * All here needed user settings except expense partition settings. 
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
  reloadAllExpensesData() {
    this.loadExpenses();
    this.calculateMonthlyYearlyExpenses();
    this.calculateMonthlyYearlyEarnings();
    this.loadSingleCustomSumsOfMonth();
    this.displayExpensesPartCalculation();
  }

  /**
   * Convert cent value to value with integers and comma (cent) values. Used to display currency value in input value
   * @param centValue 
   */
  convertCentValue(centValue): number {
    return centValue / 100;
  }

  /**
   * Display all expenses
   */
  displayAllExpenses() {
    this.displayExpensesSettings = 0;
    this.loadExpenses();
  }

  /**
   * Display expenses of previous year (-1)
   */
  displayExpensesPreviousYear() {
    this.displayExpensesSettings = 1;
    this.displayedDate.setFullYear(this.displayedDate.getFullYear() - 1);
    this.updateMonthYearDropdownSelector();
    this.loadExpenses();
    this.loadSingleCustomSumsOfMonth();
  }


  /**
   * Display expenses of next year (+1)
   */
  displayExpensesNextYear() {
    this.displayExpensesSettings = 1;
    this.displayedDate.setFullYear(this.displayedDate.getFullYear() + 1);
    this.updateMonthYearDropdownSelector();
    this.loadExpenses();
    this.loadSingleCustomSumsOfMonth();
  }

  /**
  * Display expenses of previous month of current year (-1)
  */
  displayExpensesPreviousMonth() {
    if (this.displayExpensesSettings === 1) {
      //Year was selected -> year view mode is activated
      this.displayExpensesPreviousYear();
    } else {
      this.displayExpensesSettings = 2;

      if (this.displayedDate)
        if (this.displayedDate.getMonth() === 0) {
          this.displayedDate.setMonth(11);
          this.displayedDate.setFullYear(this.displayedDate.getFullYear() - 1);
        } else {
          this.displayedDate.setMonth(this.displayedDate.getMonth() - 1);
        }
    }
    this.updateMonthYearDropdownSelector();
    this.loadExpenses();
    this.loadSingleCustomSumsOfMonth();
  }


  /**
   * Display expenses of next month of current year (+1)
   */
  displayExpensesNextMonth() {
    if (this.displayExpensesSettings === 1) {
      //Year was selected -> year view mode is activated
      this.displayExpensesNextYear();
    } else {
      this.displayExpensesSettings = 2;
      if (this.displayedDate.getMonth() === 11) {
        this.displayedDate.setMonth(0);
        this.displayedDate.setFullYear(this.displayedDate.getFullYear() + 1);
      } else {
        this.displayedDate.setMonth(this.displayedDate.getMonth() + 1);
      }
    }

    this.updateMonthYearDropdownSelector();
    this.loadExpenses();
    this.loadSingleCustomSumsOfMonth();
  }

  /**
   * Display expenses of selected month and selected year (or all expenses if not available).
   * @param selectedMonth 
   */
  selectMonthExpenses(selectedMonth) {
    this.selectedMonth = selectedMonth;
    if ((this.selectedMonth !== null && this.selectedMonth !== 0) && (this.selectedYear !== null && this.selectedYear !== 0)) {
      this.displayExpensesSettings = 2;
      this.displayedDate.setMonth(this.selectedMonth - 1);
      this.loadExpenses();
      this.loadSingleCustomSumsOfMonth();
    }
  }

  /**
   * Display expenses of selected year (or all expenses if not available) and selected month (if available).
   * @param selectedMonth 
   */
  selectYearExpenses(selectedYear) {
    this.selectedYear = selectedYear;
    if ((this.selectedMonth === null || this.selectedMonth === 0) && (this.selectedYear !== null && this.selectedYear !== 0)) {
      this.displayExpensesSettings = 1;
    } else if ((this.selectedMonth !== null && this.selectedMonth !== 0) && (this.selectedYear !== null && this.selectedYear !== 0)) {
      this.displayExpensesSettings = 2;
      this.displayedDate.setFullYear(this.selectedYear);
    }
    else {
      this.selectedYear = 0;
      this.displayExpensesSettings = 0;
    }
    this.loadExpenses();
    this.loadSingleCustomSumsOfMonth();
  }

  /**
   * Display expenses for the selected month of the current year. When there is no selected month, then show expenses for the current month and year.
   * 
   */
  clearYearSelection(event) {
    this.selectedYear = 0;

    if (this.selectedMonth !== null || this.selectedMonth !== 0) {
      this.displayExpensesSettings = 2;
      this.displayedDate.setMonth(this.selectedMonth - 1);
      this.displayedDate.setFullYear((new Date()).getFullYear());
      this.loadExpenses();
      this.loadSingleCustomSumsOfMonth();
    } else {
      this.displayExpensesSettings = 1;
      this.displayedDate.setMonth((new Date()).getMonth());
      this.displayedDate.setFullYear((new Date()).getFullYear());
      this.loadExpenses();
      this.loadSingleCustomSumsOfMonth();
    }
  }

  /**
   * Display expenses for the selected year of the current year. When there is no selected year, then show expenses for the current month and year.
   * 
   */
  clearMonthSelection(event) {
    this.selectedMonth = 0;

    if (this.selectedYear !== null || this.selectedYear !== 0) {
      this.displayExpensesSettings = 1;
      this.displayedDate.setMonth((new Date()).getMonth());
      this.displayedDate.setFullYear(this.selectedYear);
      this.loadExpenses();
      this.loadSingleCustomSumsOfMonth();
    } else {
      this.displayExpensesSettings = 2;
      this.displayedDate.setMonth((new Date()).getMonth());
      this.displayedDate.setFullYear((new Date()).getFullYear());
      this.loadExpenses();
      this.loadSingleCustomSumsOfMonth();
    }
  }

  /**
   * Calculate the expenses split to 2 people
   * @param person1Ratio 
   * @param person2Ratio 
   * @param expensesSum 
   */
  calculateExpensesPersonParts(person1Ratio, person2Ratio, expensesSum): number[] {
    if ((person1Ratio + person2Ratio) === 100) {
      this.person1SumPart = expensesSum * (person1Ratio / 100);
      this.person2SumPart = expensesSum * (person2Ratio / 100);
      return [this.person1SumPart, this.person2SumPart];
    } else {
      this.person2Ratio = 100 - this.person1Ratio;
      this.selectedPerson2Ratio = "" + this.person2Ratio;
      this.messageCreator.showErrorMessage('expensePersonPartError1');
      return [0];
    }
  }

  displayExpensesPartCalculation() {
    let parsedSum = this.expensesMonthlySum;
    parsedSum = parsedSum === NaN ? 0 : parsedSum;
    this.calculateExpensesPersonParts(this.person1Ratio, this.person2Ratio, parsedSum);
  }

  setPerson1Name(selectedValue) {
    if (selectedValue !== null) {
      this.selectedPerson1Name = selectedValue;
      this.loadedPerson1NameSetting.settingValue = this.selectedPerson1Name;
      this.userSettingsService.saveSettingsValue(this.loadedPerson1NameSetting).subscribe(() => {
      }, err => {
        this.messageCreator.showSuccessMessage("expensePersonNameError1");
      });
    }
  }

  setPerson2Name(selectedValue) {
    if (selectedValue !== null) {
      this.selectedPerson2Name = selectedValue;
      this.loadedPerson2NameSetting.settingValue = this.selectedPerson2Name;
      this.userSettingsService.saveSettingsValue(this.loadedPerson2NameSetting).subscribe(() => {
      }, err => {
        this.messageCreator.showErrorMessage("expensePersonNameError1");
      });
    }
  }

  setPerson1Ratio(selectedValue) {
    if (selectedValue !== null) {
      this.selectedPerson1Ratio = selectedValue;
      this.person1Ratio = parseInt(this.selectedPerson1Ratio);

      if (this.person1Ratio < 0 || this.person1Ratio > 100) {
        this.messageCreator.showSuccessMessage("expensePersonRatioError2");
        return;
      }
      this.loadedPerson1RatioSetting.settingValue = this.selectedPerson1Ratio;
      this.userSettingsService.saveSettingsValue(this.loadedPerson1RatioSetting).subscribe(() => {
      }, err => {
        this.messageCreator.showErrorMessage("expensePersonRatioError1");
      });
    }
  }

  setPerson2Ratio(selectedValue) {
    if (selectedValue !== null) {
      this.selectedPerson2Ratio = selectedValue;
      this.person2Ratio = parseInt(this.selectedPerson2Ratio);

      if (this.person2Ratio < 0 || this.person2Ratio > 100) {
        this.messageCreator.showSuccessMessage("expensePersonRatioError2");
        return;
      }
      this.loadedPerson2RatioSetting.settingValue = this.selectedPerson2Ratio;
      this.userSettingsService.saveSettingsValue(this.loadedPerson2RatioSetting).subscribe(() => {
      }, err => {
        this.messageCreator.showErrorMessage("expensePersonRatioError1");
      });
    }
  }

  /**
   * Delete expense and save deleted expense in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteExpense(id) {
    this.expenseService.deleteExpense(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.expenseDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.expenseDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllExpensesData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.expenseDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.expenseDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.expenseDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.expenseDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedExpenses() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.expenseService.restoreDeletedExpense(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllExpensesData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('expenseRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('expenseRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a Expense row item. 
   * @param newValue 
   * @param expenseItem 
   * @param columnName The column / attribute of the expense item that will be updated
   */
  updateExpenseValue(newValue, expenseItem, columnName) {
    //Load objects through the title
    let expenseCategoryObject = this.getExpenseCategoryByCategoryTitle(expenseItem.expenseCategory);
    let expenseTimerangeObject = this.getExpenseTimerangeByTimerangeTitle(this.expenseTranslationsTimeranges[expenseItem.expenseTimerange]);

    if (columnName === "title") {
      this.expenseService.updateExpenseTable(expenseItem.expenseId, newValue, expenseCategoryObject, expenseItem.centValue * 100, expenseTimerangeObject, expenseItem.paymentDate, expenseItem.information, expenseItem.isReminding, expenseItem.attachment, expenseItem.attachmentPath, expenseItem.attachmentName, expenseItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('expensesTableUpdatedError1');
      });
    }
    else if (columnName === "category") {
      expenseCategoryObject = this.getExpenseCategoryByCategoryTitle(newValue);
      this.expenseService.updateExpenseTable(expenseItem.expenseId, expenseItem.title, expenseCategoryObject, expenseItem.centValue * 100, expenseTimerangeObject, expenseItem.paymentDate, expenseItem.information, expenseItem.isReminding, expenseItem.attachment, expenseItem.attachmentPath, expenseItem.attachmentName, expenseItem.attachmentType).subscribe((res: String) => {
        this.reloadAllExpensesData();
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('expensesTableUpdatedError1');
      });
    }
    else if (columnName === "timerange") {
      expenseTimerangeObject = this.getExpenseTimerangeByTimerangeTitle(this.expenseTranslationsTimeranges[newValue]);
      this.expenseService.updateExpenseTable(expenseItem.expenseId, expenseItem.title, expenseCategoryObject, expenseItem.centValue * 100, expenseTimerangeObject, expenseItem.paymentDate, expenseItem.information, expenseItem.isReminding, expenseItem.attachment, expenseItem.attachmentPath, expenseItem.attachmentName, expenseItem.attachmentType).subscribe((res: String) => {
        this.reloadAllExpensesData();
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('expensesTableUpdatedError1');
      });
    }
    else if (columnName === "paymentDate") {
      let updatedDate;
      if (newValue == undefined || newValue == null || newValue == 0) {
        updatedDate = expenseItem.paymentDate;
        console.log("error")
      } {
        newValue.setHours(14);
        updatedDate = newValue;
      }
      this.expenseService.updateExpenseTable(expenseItem.expenseId, expenseItem.title, expenseCategoryObject, expenseItem.centValue * 100, expenseTimerangeObject, updatedDate, expenseItem.information, expenseItem.isReminding, expenseItem.attachment, expenseItem.attachmentPath, expenseItem.attachmentName, expenseItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('expensesTableUpdatedError1');
      })
    }
    else if (columnName === "information") {
      this.expenseService.updateExpenseTable(expenseItem.expenseId, expenseItem.title, expenseCategoryObject, expenseItem.centValue * 100, expenseTimerangeObject, expenseItem.paymentDate, newValue, expenseItem.isReminding, expenseItem.attachment, expenseItem.attachmentPath, expenseItem.attachmentName, expenseItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('expensesTableUpdatedError1');
      });
    }
    else if (columnName === "isReminding") {
      console.log("Update Expense Pay state -----")
      console.log(newValue);
      if (newValue === true) {
        this.addExpenseReminder(expenseItem);
      } else {
        this.removeExpenseReminder(expenseItem);
      }
      this.expenseService.updateExpenseTable(expenseItem.expenseId, expenseItem.title, expenseCategoryObject, expenseItem.centValue * 100, expenseTimerangeObject, expenseItem.paymentDate, expenseItem.information, newValue, expenseItem.attachment, expenseItem.attachmentPath, expenseItem.attachmentName, expenseItem.attachmentType).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('expensesTableUpdatedError1');
      });

    }
  }

  showUpdateValueDialog(updatedExpense: ExpenseTable) {
    this.currentlyUpdatingExpense = updatedExpense;
    this.currentlyUpdatingExpenseTitle = this.currentlyUpdatingExpense.title;

    this.updatedExpenseValue = "" + (updatedExpense.centValue);
    this.displayUpdateValue = true;
  }

  saveUpdateValueDialog() {
    let parsedValue = parseFloat(this.updatedExpenseValue.replace(",", "."));

    if (parsedValue === NaN || parsedValue === null) {
      this.messageCreator.showErrorMessage('expensesTableUpdatedError2');
      return;
    }
    let expenseCategoryObject = this.getExpenseCategoryByCategoryTitle(this.currentlyUpdatingExpense.expenseCategory);
    let expenseTimerangeObject = this.getExpenseTimerangeByTimerangeTitle(this.expenseTranslationsTimeranges[this.currentlyUpdatingExpense.expenseTimerange]);
    this.expenseService.updateExpenseTable(this.currentlyUpdatingExpense.expenseId, this.currentlyUpdatingExpense.title, expenseCategoryObject, parsedValue * 100, expenseTimerangeObject, this.currentlyUpdatingExpense.paymentDate, this.currentlyUpdatingExpense.information, this.currentlyUpdatingExpense.isReminding, this.currentlyUpdatingExpense.attachment, this.currentlyUpdatingExpense.attachmentPath, this.currentlyUpdatingExpense.attachmentName, this.currentlyUpdatingExpense.attachmentType).subscribe((res: String) => {
      this.reloadAllExpensesData();
    }, err => {
      console.log("UPDATE FAILED!");
      console.log(err);
      this.messageCreator.showErrorMessage('expensesTableUpdatedError1');

    });
    this.displayUpdateValue = false;
  }

  cancelUpdateValueDialog() {
    this.displayUpdateValue = false;
  }

  getExpenseCategoryByCategoryTitle(expenseCategoryTitle) {
    return this.expenseCategories.map(expenseCategoryItem => {
      if (expenseCategoryItem.categoryTitle === expenseCategoryTitle) {
        return expenseCategoryItem;
      }
    }).filter(selectedExpenseCategory => { return selectedExpenseCategory })[0];
  }


  getExpenseTimerangeByTimerangeTitle(timerangeTitle) {
    let selectedExpenseTimerange;

    this.expenseTimeranges.forEach(expenseTimerangesItem => {
      if (expenseTimerangesItem.timerangeTitle === timerangeTitle) {
        selectedExpenseTimerange = expenseTimerangesItem;
      }
    });
    return selectedExpenseTimerange;
  }

  saveExpense() {
    if (this.value.trim() == undefined) {
      this.messageCreator.showErrorMessage('expenseAddExpenseError1');
      return;
    }

    let valueParsed;
    let centValue;
    valueParsed = parseFloat(((this.value).replace(",", ".")));
    centValue = valueParsed * 100;
    if (valueParsed === Number.NaN) {
      this.messageCreator.showErrorMessage('expenseAddExpenseError1');
      return;
    }

    if (this.title === null || this.title == undefined || this.title.trim() === "") {
      this.messageCreator.showErrorMessage('expenseAddExpenseError4');
      return;
    }

    if (this.paymentDate == undefined || this.paymentDate === null) {
      this.paymentDate = new Date();
    }

    if (this.expenseCategory == undefined || this.expenseCategory == null) {
      this.messageCreator.showErrorMessage('expenseAddExpenseError5');
      return;
    }


    if (this.information == undefined || this.information == null) {
      this.information = "";
    }

    let expenseTimerangeObject = this.getExpenseTimerangeByTimerangeTitle(this.expenseTranslationsTimeranges[this.expenseTimerange]);
    if (this.expenseTimerange == undefined || this.expenseTimerange === null) {
      //When time range was not selected, then the expense is added as one time expense
      expenseTimerangeObject = this.expenseTimeranges[0];
    }

    this.paymentDate.setHours(14);

    this.expenseService.saveExpense(this.title, this.expenseCategory, centValue, expenseTimerangeObject, this.paymentDate, this.information, this.isReminding, false, "", "", "").subscribe((savedExpense: Expense) => {
      if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
        if (this.attachmentFile.name != null) {
          this.attachmentName = "" + savedExpense.expenseId;
          this.attachmentPath = this.attachmentName + "." + this.attachmentType;
          this.expenseService.addExpenseAttachment(savedExpense.expenseId, this.attachmentType, this.attachmentFile).subscribe(
            () => {
              this.expenseService.updateExpense(savedExpense.expenseId, savedExpense.title, savedExpense.expenseCategory, savedExpense.centValue, savedExpense.expenseTimerange, savedExpense.paymentDate, savedExpense.information, savedExpense.isReminding, true, this.attachmentPath, this.attachmentName, this.attachmentType).subscribe(() => {
                this.reloadAllExpensesData();
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

      if (this.isReminding === true) {
        this.addExpenseReminder(savedExpense);
      }
      this.messageCreator.showSuccessMessage('expenseAddExpenseAdded1');
      this.reloadAllExpensesData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('expenseAddExpenseError2');
    });
  }

  addExpenseReminder(savedExpense: Expense) {
    this.expenseReminderService.saveExpenseReminder(savedExpense.expenseId, savedExpense.paymentDate).subscribe((savedExpenseReminder: ExpenseReminder) => {
    }, err => {
      console.log(err);
    });
  }

  removeExpenseReminder(savedExpense: Expense) {
    this.expenseReminderService.deleteExpenseReminderByExpenseId(savedExpense.expenseId).subscribe(() => {
    }, err => {
      console.log(err);
    })
  }

  addExpenseCategory() {
    if (this.newCategoryName.trim() !== "") {
      this.expenseCategoryService.saveExpenseCategory(this.newCategoryName).subscribe(
        (savedExpenseCategory: ExpenseCategory) => {
          this.messageCreator.showSuccessMessage('expensesTableAddCategoryOK1');
          this.expenseBudgetService.saveExpenseBudget(savedExpenseCategory, 0, 0, 0, "", "").subscribe(() => { }, err => console.log(err));
          this.loadExpenseCategories();
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage('expensesTableAddCategoryError1');
          this.loadExpenseCategories();
        });
    } else {
      this.messageCreator.showErrorMessage('expensesTableAddCategoryError2');
    }
  }

  onExpenseAttachmentUpload(event) {
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
    if (this.editSelectedExpenseCategory != null) {
      this.expenseService.updateExpenseCategoriesOfExpenses(this.editSelectedExpenseCategory.expenseCategoryId, this.updatedExpenseCategory.expenseCategoryId).subscribe(
        () => {
          this.loadExpenses();
          this.loadExpenseCategories();
          this.messageCreator.showSuccessMessage("expensesEditCategoryOk1");
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage('expensesEditCategoryError2');
        });
    } else {
      this.messageCreator.showErrorMessage('expensesEditCategoryError1');
    }
  }

  updateExpenseAttachment() {
    let parsedUpdatedAttachmentId = parseInt(this.updatedAttachmentId);

    if (parsedUpdatedAttachmentId === null || parsedUpdatedAttachmentId === Number.NaN || parsedUpdatedAttachmentId === 0) {
      this.messageCreator.showErrorMessage('expensesupdatedAttachmentError1');
      return;
    }

    if (typeof this.attachmentFile != undefined && this.attachmentFile != null) {
      if (this.attachmentFile.name != null) {
        this.attachmentName = "" + parsedUpdatedAttachmentId;
        this.attachmentPath = this.attachmentName + "." + this.attachmentType;
        this.expenseService.addExpenseAttachment(parsedUpdatedAttachmentId, this.attachmentType, this.attachmentFile).subscribe(
          () => {
            this.messageCreator.showErrorMessage('expensesupdatedAttachmentOk1');
          },
          (err) => {
            this.messageCreator.showErrorMessage('expensesupdatedAttachmentError3');
          });
      }
    } else {
      this.messageCreator.showErrorMessage('expensesupdatedAttachmentError2');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.expenses);
        doc.save('expenses.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.expenses);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "expenses");
    });
  }

  exportReminderPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumnsReminder, this.expenseremindersExport);
        doc.save('expenses_to_pay.pdf');
      })
    })
  }

  exportReminderExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.expenseremindersExport);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "expenses_to_pay");
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
    this.loadExpenses();
  }

  /**
   * Redirect to the attachment file of savedAttachmentPath
   * @param savedAttachmentPath 
   */
  openAttachment(savedAttachmentPath) {
    this.userService.authenticateWebDav().subscribe(() => {
      window.open(this.apiConfig.baseAttachmentUrl + this.expenseService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    }, (err) => {
      window.open(this.apiConfig.baseAttachmentUrl + this.expenseService.uriAttachment + "/" + savedAttachmentPath, '_blank');
    });
  }

}
