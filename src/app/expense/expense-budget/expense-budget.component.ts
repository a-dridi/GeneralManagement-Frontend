import { Component, OnInit } from '@angular/core';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ExpenseBudget } from 'src/app/model/expense-budget.model';
import { ExpenseCategory } from 'src/app/model/expense-category.model';
import { ExpenseBudgetService } from '../expense-budget.service';
import { ExpenseCategoryService } from '../expensecategory.services';

@Component({
  selector: 'app-expense-budget',
  templateUrl: './expense-budget.component.html',
  styleUrls: ['./expense-budget.component.scss']
})
export class ExpenseBudgetComponent implements OnInit {

  tableColumns: any[];
  expenseBudgetList: ExpenseBudget[];
  expenseCategories: ExpenseCategory[];
  loading: boolean;
  faTable = faTable;

  constructor(private expenseBudgetService: ExpenseBudgetService, private expenseCategoryService: ExpenseCategoryService, private translateService: TranslateService, private messageService: MessageService) { }

  ngOnInit(): void {
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
    this.getAllExpenseBudget();
  }

  getAllExpenseBudget() {
    this.expenseBudgetService.getAllExpenseBudget().subscribe((expenseBudgetArray: ExpenseBudget[]) => {
      this.expenseBudgetList = expenseBudgetArray;
    }, (err) => {
      this.translateService.get(['messages.expenseBudgetLoadError1']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expenseBudgetLoadError1'] });
      });
    });
  }

  loadExpenseCategories() {
    this.expenseCategoryService.getAllExpenseCategory().subscribe((data: ExpenseCategory[]) => {
      this.expenseCategories = data;
    }, err => {
    });
  }

    /**
   * Update row value for a ExpenseBudget row item. 
   * @param newValue new Value that will be add to the updated ExpenseBudget row item 
   * @param expenseBudgetRowItem 
   * @param columnName The column / attribute of the expense budget that will be updated
   */
  updateTable(newValue,  expenseBudgetRowItem, columnName) {
    if(columnName === "centBudgetValue") {
      this.expenseBudgetService.updateExpenseBudget(expenseBudgetRowItem.expensesbudgetId, expenseBudgetRowItem.expenseCategory, newValue, expenseBudgetRowItem.centActualExpenses, expenseBudgetRowItem.centDifference, expenseBudgetRowItem.s, expenseBudgetRowItem.notice).subscribe(() => {
        this.translateService.get(['messages.expenseBudgetTableUpdatedOK1']).subscribe(translations => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expenseBudgetTableUpdatedOK1'] });
        });  
      });
    }
    if(columnName === "notice") {
      this.expenseBudgetService.updateExpenseBudget(expenseBudgetRowItem.expensesbudgetId, expenseBudgetRowItem.expenseCategory, expenseBudgetRowItem.centBudgetValue, expenseBudgetRowItem.centActualExpenses, expenseBudgetRowItem.centDifference, expenseBudgetRowItem.s, newValue).subscribe(() => {
        this.translateService.get(['messages.expenseBudgetTableUpdatedOK1']).subscribe(translations => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expenseBudgetTableUpdatedOK1'] });
        });  
      });
    }

  }

  
  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.tableColumns, this.expenseBudgetList);
        doc.save('products.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.expenseBudgetList);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
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
