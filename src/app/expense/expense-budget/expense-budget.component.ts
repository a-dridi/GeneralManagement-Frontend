import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { ExpenseBudget } from 'src/app/expense/model/expense-budget.model';
import { ExpenseBudgetTable } from 'src/app/expense/model/expense-budget-table.model';
import { ExpenseCategory } from 'src/app/expense/model/expense-category.model';
import { ExpenseBudgetService } from '../expense-budget.service';
import { ExpenseCategoryService } from '../expensecategory.services';
import { MessageCreator } from 'src/app/util/messageCreator';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { UserSettingsService } from 'src/app/user-settings.service';
import { AppLanguageLoaderHelper } from 'src/app/util/languages.config';
import { UserSetting } from 'src/app/user/model/user-setting.model';
import { ExpenseTableChangedService } from '../expense-table-changed.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-expense-budget',
  templateUrl: './expense-budget.component.html',
  styleUrls: ['./expense-budget.component.scss']
})
export class ExpenseBudgetComponent implements OnInit, OnDestroy {
  standardTableWidth = 1000;
  //Settings
  selectedCurrency: string = "USD";

  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  years: number[] = [];
  selectedMonth: number = null;
  selectedYear: number;

  displayedDate: Date;
  displayedDateString: string;

  localeOfUser: string = "en";
  tableColumns: any[];
  expenseBudgetList: ExpenseBudgetTable[];
  expenseCategories: ExpenseCategory[];
  loading: boolean = true;

  faTable = faTable;

  private expBudgetSubscriptions: Subscription[] = [];

  @Output()
  initInputValue: EventEmitter<any> = new EventEmitter;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private expenseBudgetService: ExpenseBudgetService, private expenseCategoryService: ExpenseCategoryService, private translateService: TranslateService, private messageService: MessageService, private messageCreator: MessageCreator, private userSettingsService: UserSettingsService, private appLanguageLoaderHelper: AppLanguageLoaderHelper, private expenseTableChangedService: ExpenseTableChangedService) { }

  ngOnInit(): void {
    this.localeOfUser = this.appLanguageLoaderHelper.userLanguageCode;

    this.loading = true;
    this.initInputValue.emit();
    this.translateService.get(['expensebudget.tableHeaderCategory', 'expensebudget.tableHeaderCentBudgetValue',
      'expensebudget.tableHeaderCentBudgetCentActualExpenses', 'expensebudget.tableHeaderCentBudgetCentDifference',
      'expensebudget.tableHeaderS', 'expensebudget.tableHeaderNotice']).subscribe(translations => {
        this.tableColumns = [
          { field: 'expenseCategory', header: translations['expensebudget.tableHeaderCategory'] },
          { field: 'centBudgetValue', header: translations['expensebudget.tableHeaderCentBudgetValue'] },
          { field: 'centActualExpenses', header: translations['expensebudget.tableHeaderCentBudgetCentActualExpenses'] },
          { field: 'centDifference', header: translations['expensebudget.tableHeaderCentBudgetCentDifference'] },
          { field: 's', header: translations['expensebudget.tableHeaderS'] },
          { field: 'notice', header: translations['expensebudget.tableHeaderNotice'] }
        ]
      });

    this.loadUserSettings();
    this.loadExpenseCategories();
    this.loadYearsSelectorValues();

    this.displayedDate = new Date();
    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedYear = new Date().getFullYear();
    this.getSelectedMonthExpenseBudget();
    this.expBudgetSubscriptions.push(this.expenseTableChangedService.currentNotification.subscribe(notificationMessage =>
      this.reloadTableData()
    ));
  }

  ngAfterViewInit() {
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }

  ngOnDestroy() {
    this.expBudgetSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadUserSettings() {
    this.expBudgetSubscriptions.push(this.userSettingsService.getUserSettingBySettingsKey("currency").subscribe((userSetting: UserSetting) => {
      this.selectedCurrency = userSetting.settingValue;
    }, err => {
      console.log(err);
    })
    );
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

  getSelectedMonthExpenseBudget() {
    this.expBudgetSubscriptions.push(this.expenseBudgetService.getCertainExpenseBudget(this.displayedDate.getMonth() + 1, this.displayedDate.getFullYear()).subscribe((expenseBudgetArray: ExpenseBudget[]) => {
      this.expenseBudgetList = [];
      let budgetArrayLength = expenseBudgetArray.length;
      let arrayIndex = 1;

      expenseBudgetArray.forEach((expensebudgetItem: ExpenseBudget) => {
        if (arrayIndex < budgetArrayLength) {
          this.expenseBudgetList.push({ expensesbudgetId: expensebudgetItem.expensesbudgetId, expenseCategory: expensebudgetItem.expenseCategory.categoryTitle, centBudgetValue: expensebudgetItem.centBudgetValue, centActualExpenses: expensebudgetItem.centActualExpenses, centDifference: expensebudgetItem.centDifference, s: expensebudgetItem.s, notice: expensebudgetItem.notice });
        } else {
          this.expenseBudgetList.push({ expensesbudgetId: 0, expenseCategory: '', centBudgetValue: expensebudgetItem.centBudgetValue, centActualExpenses: expensebudgetItem.centActualExpenses, centDifference: expensebudgetItem.centDifference, s: expensebudgetItem.s, notice: '' });
        }
        arrayIndex++;
      });
      this.displayedDateString = "(" + (this.displayedDate.getMonth() + 1) + "/" + this.displayedDate.getFullYear() + ")";
      this.loading = false;

    }, (err) => {
      this.loading = false;
      this.expBudgetSubscriptions.push(this.translateService.get(['messages.expenseBudgetLoadError1']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expenseBudgetLoadError1'] });
      }));
      console.log(err);
    }));
  }

  loadExpenseCategories() {
    this.expBudgetSubscriptions.push(this.expenseCategoryService.getAllExpenseCategory().subscribe((data: ExpenseCategory[]) => {
      this.expenseCategories = data;
    }, err => {
    }));
  }

  /**
  * Display budget expenses of previous month of current year (-1)
  */
  displayBudgetExpensesPreviousMonth() {
    this.loading = true;
    if (this.displayedDate.getMonth() === 0) {
      this.displayedDate.setMonth(11);
      this.displayedDate.setFullYear(this.displayedDate.getFullYear() - 1);
    } else {
      this.displayedDate.setMonth(this.displayedDate.getMonth() - 1);
    }
    this.selectedMonth = this.displayedDate.getMonth() + 1;

    this.getSelectedMonthExpenseBudget();
  }

  /**
   * Display budget expenses of next month of current year (+1)
   */
  displayBudgetExpensesNextMonth() {
    this.loading = true;
    if (this.displayedDate.getMonth() === 11) {
      this.displayedDate.setMonth(0);
      this.displayedDate.setFullYear(this.displayedDate.getFullYear() + 1);
    } else {
      this.displayedDate.setMonth(this.displayedDate.getMonth() + 1);
    }
    this.selectedMonth = this.displayedDate.getMonth() + 1;

    this.getSelectedMonthExpenseBudget();
  }

  /**
   * Display budget expenses of selected month and selected year (or budget expenses of current month if not available).
   * @param selectedMonth 
   */
  selectMonthBudgetExpenses(selectedMonth) {
    this.loading = true;
    this.selectedMonth = selectedMonth;
    if ((this.selectedMonth !== null && this.selectedMonth !== 0) && (this.selectedYear !== null && this.selectedYear !== 0)) {
      this.displayedDate.setMonth(this.selectedMonth - 1);
    } else {
      this.displayedDate = new Date();
    }
    this.getSelectedMonthExpenseBudget();
  }

  /**
   * Display budget expenses of selected year and selected month (or budget expenses of current month/year if not available).
   * @param selectedYear 
   */
  selectYearBudgetExpenses(selectedYear) {
    this.loading = true;
    this.selectedYear = selectedYear;
    if ((this.selectedMonth !== null || this.selectedMonth !== 0) && (this.selectedYear !== null && this.selectedYear !== 0)) {
      this.displayedDate.setFullYear(this.selectedYear);
    }
    else {
      this.displayedDate = new Date();
    }
    this.getSelectedMonthExpenseBudget();
  }

  /**
   * Display budget expenses current month and year.
   * 
   */
  clearMonthSelection(event) {
    this.loading = true;
    this.displayedDate = new Date();
    this.getSelectedMonthExpenseBudget();
  }


  reloadTableData() {
    this.loadExpenseCategories();
    this.getSelectedMonthExpenseBudget();
  }

  /**
 * Update row value for a ExpenseBudget row item. 
 * @param newValue new Value that will be add to the updated ExpenseBudget row item 
 * @param expenseBudgetRowItem 
 * @param columnName The column / attribute of the expense budget that will be updated
 */
  updateTable(newValue, expenseBudgetRowItem, columnName) {
    let expenseCategoryObject = this.getExpenseCategoryByCategoryTitle(expenseBudgetRowItem.expenseCategory);
    if (columnName === "centBudgetValue") {
      let centValue = newValue * 100;
      console.log(centValue);
      this.expBudgetSubscriptions.push(this.expenseBudgetService.updateExpenseBudget(expenseBudgetRowItem.expensesbudgetId, expenseCategoryObject, centValue, expenseBudgetRowItem.centActualExpenses, expenseBudgetRowItem.centDifference, expenseBudgetRowItem.s, expenseBudgetRowItem.notice).subscribe(
        () => {
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage("expenseBudgetTableUpdatedError1");
        }));
    }
    if (columnName === "notice") {
      this.expBudgetSubscriptions.push(this.expenseBudgetService.updateExpenseBudget(expenseBudgetRowItem.expensesbudgetId, expenseCategoryObject, expenseBudgetRowItem.centBudgetValue, expenseBudgetRowItem.centActualExpenses, expenseBudgetRowItem.centDifference, expenseBudgetRowItem.s, newValue).subscribe(
        () => {
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage("expenseBudgetTableUpdatedError1");
        }));
    }
  }

  /**
   * Convert cent value to value with integers and comma (cent) values. Used to display currency value in input value
   * @param centValue 
   */
  convertCentValue(centValue): number {
    return centValue / 100;
  }

  getExpenseCategoryByCategoryTitle(expenseCategoryTitle) {
    return this.expenseCategories.map(expenseCategoryItem => {
      if (expenseCategoryItem.categoryTitle === expenseCategoryTitle) {
        return expenseCategoryItem;
      }
    }).filter(selectedExpenseCategory => { return selectedExpenseCategory })[0];
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.tableColumns, this.expenseBudgetList);
        doc.save('expense_budget.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.expenseBudgetList);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "expense_budget");
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
}
