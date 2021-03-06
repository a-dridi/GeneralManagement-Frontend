import { Component, OnInit } from '@angular/core';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ExpenseCategory } from 'src/app/expense/model/expense-category.model';
import { ExpenseGraph } from 'src/app/expense/model/expense-graph.model';
import { MessageCreator } from 'src/app/util/messageCreator';
import { ExpenseCategoryService } from '../expensecategory.services';
import { ExpenseGraphService } from '../expensegraph.services';

@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.scss']
})
export class ExpenseCategoryComponent implements OnInit {

  expenseCategoriesMonthly: ExpenseGraph[];
  expenseCategoriesYearly: ExpenseGraph[];
  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];
  expenseCategories: ExpenseCategory[];

  faTable = faTable;
  loading: boolean;

  constructor(private messageCreator: MessageCreator, private expenseGraphService: ExpenseGraphService, private expenseCategoryService: ExpenseCategoryService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['expensecategory.expenseCategoryTableHeaderCategory', 'expensecategory.expenseCategoryTableHeaderSum']).subscribe(translations => {
      this.tableColumns = [
        { field: 'expenseCategory', header: translations['expensecategory.expenseCategoryTableHeaderCategory'] },
        { field: 'centValue', header: translations['expensecategory.expenseCategoryTableHeaderSum'] }
      ];
      this.exportColumns = [
        { field: 'expenseCategory', header: translations['expensecategory.expenseCategoryTableHeaderCategory'] },
        { field: 'centValue', header: translations['expensecategory.expenseCategoryTableHeaderSum'] }
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    });
    this.loadExpenseCategories();
    this.loadExpenseSumCategories();
  }

  loadExpenseSumCategories() {
    this.expenseGraphService.getAllMonthlyExpensesSum().subscribe((expenseCategories: ExpenseGraph[]) => {
      this.expenseCategoriesMonthly = expenseCategories;
    }, err => {
      this.messageCreator.showErrorMessage('expenseCategoryError1');
      console.log(err);
    });

    this.expenseGraphService.getAllYearlyExpensesSum().subscribe((expenseCategories: ExpenseGraph[]) => {
      this.expenseCategoriesYearly = expenseCategories;
      this.loading = false;
    }, err => {
      this.messageCreator.showErrorMessage('expenseCategoryError1');
      console.log(err);
      this.loading = false;
    });
  }

  loadExpenseCategories() {
    this.expenseCategoryService.getAllExpenseCategory().subscribe((data: ExpenseCategory[]) => {
      this.expenseCategories = data;
    }, err => {
    });
  }

  exportPdfMonthly() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.expenseCategoriesMonthly);
        doc.save('monthly_expenses.pdf');
      })
    })
  }

  exportExcelMonthly() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.expenseCategoriesMonthly);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "monthly_expenses");
    });
  }

  exportPdfYearly() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.expenseCategoriesYearly);
        doc.save('yearly_expenses.pdf');
      })
    })
  }

  exportExcelYearly() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.expenseCategoriesYearly);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "yearly_expenses");
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
