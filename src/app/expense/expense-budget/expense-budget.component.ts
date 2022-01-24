import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
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

@Component({
  selector: 'app-expense-budget',
  templateUrl: './expense-budget.component.html',
  styleUrls: ['./expense-budget.component.scss']
})
export class ExpenseBudgetComponent implements OnInit {
  standardTableWidth = 1000;
  //Settings
  selectedCurrency: string = "USD";
  
  localeOfUser: string = "en";
  tableColumns: any[];
  expenseBudgetList: ExpenseBudgetTable[];
  expenseCategories: ExpenseCategory[];
  loading: boolean = true;
  faTable = faTable;

  @Output()
  initInputValue: EventEmitter<any> = new EventEmitter;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private expenseBudgetService: ExpenseBudgetService, private expenseCategoryService: ExpenseCategoryService, private translateService: TranslateService, private messageService: MessageService, private messageCreator: MessageCreator, private userSettingsService: UserSettingsService, private appLanguageLoaderHelper: AppLanguageLoaderHelper) { }

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
    this.getAllExpenseBudget();
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

  getAllExpenseBudget() {
    this.expenseBudgetService.getAllExpenseBudget().subscribe((expenseBudgetArray: ExpenseBudget[]) => {
      this.expenseBudgetList = [];
      expenseBudgetArray.forEach((expensebudgetItem: ExpenseBudget) => {
        this.expenseBudgetList.push({ expensesbudgetId: expensebudgetItem.expensesbudgetId, expenseCategory: expensebudgetItem.expenseCategory.categoryTitle, centBudgetValue: expensebudgetItem.centBudgetValue, centActualExpenses: expensebudgetItem.centActualExpenses, centDifference: expensebudgetItem.centDifference, s: expensebudgetItem.s, notice: expensebudgetItem.notice });
      });
      this.loading = false;
    }, (err) => {
      this.loading = false;
      this.translateService.get(['messages.expenseBudgetLoadError1']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expenseBudgetLoadError1'] });
      });
      console.log(err);
    });
  }

  loadExpenseCategories() {
    this.expenseCategoryService.getAllExpenseCategory().subscribe((data: ExpenseCategory[]) => {
      this.expenseCategories = data;
    }, err => {
    });
  }

  reloadTableData() {
    this.loadExpenseCategories();
    this.getAllExpenseBudget();
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
      this.expenseBudgetService.updateExpenseBudget(expenseBudgetRowItem.expensesbudgetId, expenseCategoryObject, centValue, expenseBudgetRowItem.centActualExpenses, expenseBudgetRowItem.centDifference, expenseBudgetRowItem.s, expenseBudgetRowItem.notice).subscribe(
        () => {
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage("expenseBudgetTableUpdatedError1");
        });
    }
    if (columnName === "notice") {
      this.expenseBudgetService.updateExpenseBudget(expenseBudgetRowItem.expensesbudgetId, expenseCategoryObject, expenseBudgetRowItem.centBudgetValue, expenseBudgetRowItem.centActualExpenses, expenseBudgetRowItem.centDifference, expenseBudgetRowItem.s, newValue).subscribe(
        () => {
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage("expenseBudgetTableUpdatedError1");
        });
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
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

}
