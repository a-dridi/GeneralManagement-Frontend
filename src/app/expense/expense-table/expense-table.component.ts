import { fingerprint } from '@angular/compiler/src/i18n/digest';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight, faCalendarCheck, faCheckSquare, faEuroSign, faFolderPlus, faFont, faHistory, faInfo, faPaperclip, faPlus, faPlusCircle, faRetweet, faTable, faTags } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ExpenseCategory } from 'src/app/model/expense-category.model';
import { ExpenseTimerange } from 'src/app/model/expense-timerange.model';
import { Expense } from 'src/app/model/expense.model';
import { UserService } from 'src/app/user/user.service';
import { ApiConfig } from 'src/app/util/api.config';
import { ExpenseBudgetService } from '../expense-budget.service';
import { ExpenseService } from '../expense.service';
import { ExpenseCategoryService } from '../expensecategory.services';
import { ExpenseTimerangeService } from '../expensetimerange.services';

@Component({
  selector: 'app-expense-table',
  templateUrl: './expense-table.component.html',
  styleUrls: ['./expense-table.component.scss']
})
export class ExpenseTableComponent implements OnInit {

  person1SumPart: number;
  person2SumPart: number;
  person1Ratio: number = 50;
  person2Ratio: number = 50;
  loading: boolean;

  tableColumns: any[];
  expenses: Expense[];
  expensesAmountInfo: string = "";
  expensesSum: number;

  expenseCategories: ExpenseCategory[];
  expenseTimeranges: ExpenseTimerange[];

  expensesMonthlySum: string;
  expensesYearlySum: string;
  expensesAverageSum: string;

  displayedDate: Date;
  displayedDateString: string;

  //new expense data
  title: string;
  expenseCategory: ExpenseCategory;
  value: String;
  expenseTimerange: ExpenseTimerange;
  paymentDate: Date;
  information: string;
  attachment: boolean = false;
  attachmentPath: string;
  attachmentName: string;
  attachmentType: string;
  attachmentFile: any;

  newCategoryName: string;

  //Sets which expenses to display | 0 -> all, 1-> the selected year (default - the current year), 2-> the selected month, year
  displayExpensesSettings = 1;

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

  @ViewChild('categoryselector') categoryselector: ElementRef;
  @ViewChild('timerangeselector') timerangeselector: ElementRef;
  @ViewChild('calendarInput') calendarinput: ElementRef;

  constructor(private userService: UserService, private messageService: MessageService, private apiConfig: ApiConfig, private expenseService: ExpenseService, private expenseCategoryService: ExpenseCategoryService, private expenseTimerangeService: ExpenseTimerangeService, private translateService: TranslateService, private expenseBudgetService: ExpenseBudgetService) {
    this.displayedDate = new Date();
    this.displayedDateString = "(" + this.displayedDate.getFullYear() + ")";
  }

  /**
   * Load expenses and table header translations
   */
  ngOnInit(): void {
    this.translateService.get(['messages.loginLoginFailedError1', 'messages.expenseDeleteOk1', 'messages.expenseDeleteOk1', 'expense.expenseTableHeaderTitle', 'expense.expenseTableHeaderCategory', 'expense.expenseTableHeaderValue', 'expense.expenseTableHeaderTimerange', 'expense.expenseTableHeaderPaymentdate', 'expense.expenseTableHeaderInformation']).subscribe(translations => {
      this.tableColumns = [{ field: 'id', header: 'ID' },
      { field: 'title', header: translations['expense.expenseTableHeaderTitle'] },
      { field: 'category', header: translations['expense.expenseTableHeaderCategory'] },
      { field: 'value', header: translations['expense.expenseTableHeaderValue'] },
      { field: 'timerange', header: translations['expense.expenseTableHeaderTimerange'] },
      { field: 'paymentdate', header: translations['expense.expenseTableHeaderPaymentdate'] },
      { field: 'information', header: translations['expense.expenseTableHeaderInformation'] }
      ]
    });
    this.loadExpenseCategories();
    this.loadExpenseTimeranges();
    this.loadExpenses();
    this.calculateMonthlyYearlyExpenses();
    this.loadSingleCustomSumsOfMonth();
    this.calculateExpensesPersonParts(this.person1Ratio, this.person2Ratio);

  }

  ngAfterViewInit() {
    this.loadDropdownStyle();
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
    if(this.calendarinput) {
      this.calendarinput.nativeElement.querySelector(".p-dropdown-label").style.fontSize = "20px";
      this.calendarinput.nativeElement.querySelector(".p-dropdown-label").style.margin = "auto";
    }
  }

  reloadDropdown(event) {
    setTimeout(() => { this.loadDropdownStyle(); }, 100);
    this.loadDropdownStyle();
  }

  calculateExpensesPersonParts(person1Ratio, person2Ratio) {
    if ((person1Ratio + person2Ratio) === 100) {
      this.person1SumPart = this.expensesSum * (person1Ratio / 100);
      this.person2SumPart = this.expensesSum * (person2Ratio / 100);
    } else {
      this.translateService.get(['messages.expensePersonPartError1']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expensePersonPartError1'] });
      });
    }
  }

  /**
   * Load expenses all, of a certain year or month. This is setup through the instance variable displayExpensesSettings. 
   */
  loadExpenses() {
    if (this.displayExpensesSettings === 0) {
      this.displayedDateString = "";
      this.expenseService.getAllExpenseTable().subscribe((data: Expense[]) => {
        this.expenses = data;
        this.translateService.get(['messages.numberOfAvailableDatasets']).subscribe(translations => {
          this.expensesAmountInfo = (translations['messages.numberOfAvailableDatasets']).replace("#?", this.expenses.length);
        });
      });
    } else if (this.displayExpensesSettings === 1) {
      this.displayedDateString = "(" + this.displayedDate.getFullYear() + ")";
      this.expenseService.getExpensesOfCertainYearTable(this.displayedDate.getFullYear()).subscribe((data: Expense[]) => {
        this.expenses = data;
        this.translateService.get(['messages.numberOfAvailableDatasets']).subscribe(translations => {
          this.expensesAmountInfo = (translations['messages.numberOfAvailableDatasets']).replace("#?", this.expenses.length);
        });
      });
    } else if (this.displayExpensesSettings === 2) {
      this.displayedDateString = "(" + (this.displayedDate.getMonth() + 1) + "/" + this.displayedDate.getFullYear() + ")";
      this.expenseService.getExpensesOfCertainMonthYearTable(this.displayedDate.getMonth() + 1, this.displayedDate.getFullYear()).subscribe((data: Expense[]) => {
        this.expenses = data;
        this.translateService.get(['messages.numberOfAvailableDatasets']).subscribe(translations => {
          this.expensesAmountInfo = (translations['messages.numberOfAvailableDatasets']).replace("#?", this.expenses.length);
        });
      }, err => {
      });
    }
    this.loadSingleCustomSumsOfMonth();
  }

  loadExpenseCategories() {
    this.expenseCategoryService.getAllExpenseCategory().subscribe((data: ExpenseCategory[]) => {
      this.expenseCategories = data;
    }, err => {
    });
  }

  loadExpenseTimeranges() {
    this.expenseTimerangeService.getAllExpenseTimerange().subscribe((data: ExpenseTimerange[]) => {
      this.expenseTimeranges = data;
    }, err => {
    });
  }

  calculateMonthlyYearlyExpenses() {
    this.expenseService.getMonthlyExpensesSum().subscribe((data: number) => {
      this.expensesMonthlySum = (data * 100).toFixed(2);
      this.expensesYearlySum = (data * 100 * 12).toFixed(2);
    });
  }

  /**
   * Load average sum for the selected month
   */
  loadSingleCustomSumsOfMonth() {
    this.expenseService.getOfCertainMonthSingleAndCustomExpensesSum(this.displayedDate.getMonth() + 1).subscribe((data: Number) => {
      this.expensesAverageSum = (data.toFixed(2));
    });
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
    this.loadExpenses();
  }


  /**
   * Display expenses of next year (+1)
   */
  displayExpensesNextYear() {
    this.displayExpensesSettings = 1;
    this.displayedDate.setFullYear(this.displayedDate.getFullYear() + 1);
    this.loadExpenses();
  }

  /**
 * Display expenses of previous month of current year (-1)
 */
  displayExpensesPreviousMonth() {
    this.displayExpensesSettings = 2;
    if (this.displayedDate.getMonth() === 0) {
      this.displayedDate.setMonth(11);
      this.displayedDate.setFullYear(this.displayedDate.getFullYear() - 1);
    } else {
      this.displayedDate.setMonth(this.displayedDate.getMonth() - 1);
    }
    this.loadExpenses();
  }


  /**
   * Display expenses of next month of current year (+1)
   */
  displayExpensesNextMonth() {
    this.displayExpensesSettings = 2;
    if (this.displayedDate.getMonth() === 11) {
      this.displayedDate.setMonth(0);
      this.displayedDate.setFullYear(this.displayedDate.getFullYear() + 1);
    } else {
      this.displayedDate.setMonth(this.displayedDate.getMonth() + 1);
    }
    this.loadExpenses();
  }

  deleteExpense(id) {
    this.expenseService.deleteExpense(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.expenseDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.expenseDeletedOk1']).replace('#?', id) });
        });
        localStorage.setItem("app32xExpensesDeleted", (localStorage.getItem("app32xExpensesDeleted") + ";" + id));
        this.loadExpenses();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.expenseDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.expenseDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.expenseDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.expenseDeletedOk1']).replace('#?', id) });
          });
          localStorage.setItem("app32xExpensesDeleted", (localStorage.getItem("app32xExpensesDeleted") + ";" + id));
        }
      });
  }
  restoreDeletedExpenses() {
    let deletedIdsString = localStorage.getItem("app32xExpensesDeleted");
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.expenseService.restoreDeletedExpense(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
          }, err => {
          }
        );
      });

      if (restoredSuccessfulNumber === deletedIdsArray.length) {
        this.translateService.get(['messages.expenseRestoreDeletedOK1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: translations['messages.expenseRestoreDeletedOK1'] });

        });
      } else {
        this.translateService.get(['messages.expenseRestoreDeletedError1']).subscribe(translations => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expenseRestoreDeletedError1'] });
        });
      }
    }
  }

  /**
   * Update row value for a Expense row item. 
   * @param newValue 
   * @param expenseItem 
   * @param columnName The column / attribute of the expense item that will be updated
   */
  updateExpenseValue(newValue, expenseItem, columnName) {
    console.log("NEW!!!");

    console.log(newValue);
    console.log(expenseItem);
    console.log(expenseItem.Id);
    
    if (columnName === "title") {
      this.expenseService.updateExpenseTable(expenseItem.Id, newValue, expenseItem.expenseCategory, expenseItem.centValue, expenseItem.expenseTimerange, expenseItem.paymentDate, expenseItem.information, expenseItem.attachment, expenseItem.attachmentPath, expenseItem.attachmentName, expenseItem.attachmentType).subscribe((res: String) => {
        this.translateService.get(['messages.expensesTableUpdatedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: translations['messages.expensesTableUpdatedOk1'] });
        });
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
      })
    }
  }

  saveExpense() {
    if (this.value.trim() === "") {
      this.value = "0";
    }
    console.log("VALUE");
    console.log(this.value);

    let valueParsed;
    let centValue;

    if (this.value.includes(".") || this.value.includes(",")) {
      valueParsed = parseFloat(((this.value).replace(",", ".")));
      centValue = valueParsed * 100;
    } else {
      centValue = valueParsed * 100;
    }

    console.log("PARSEDVALUE");
    console.log(valueParsed);
    console.log("CENTVALUE");
    console.log(centValue);

    if (valueParsed === Number.NaN) {
      this.translateService.get(['messages.expenseAddExpenseError1']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expenseAddExpenseError1'] });
      });
      return;
    }

    if (this.expenseCategory === null || this.expenseCategory === undefined) {
      this.translateService.get(['messages.expenseAddExpenseError3']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expenseAddExpenseError3'] });
      });
      return;
    }

    if (this.title === null || this.title === undefined || this.title.trim() === "") {
      this.translateService.get(['messages.expenseAddExpenseError4']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expenseAddExpenseError4'] });
      });
      return;
    }

    if (this.paymentDate === undefined || this.paymentDate === null) {
      this.paymentDate = new Date();
    }
    this.expenseService.saveExpense(this.title, this.expenseCategory, centValue, this.expenseTimerange, this.paymentDate, this.information, false, "", "", "").subscribe((savedExpense: Expense) => {
      console.log("Check attachment file");
      console.log(this.attachmentFile);
      console.log(savedExpense);
      if (this.attachmentFile != undefined && this.attachmentFile != null) {
        if (this.attachmentFile.name != null) {
          this.attachmentName = "" + savedExpense.expenseId;
          this.attachmentPath = this.attachmentName + "." + this.attachmentType;
          this.expenseService.addExpenseAttachment(savedExpense.expenseId, this.attachmentType, this.attachmentFile).subscribe(
            () => {
              console.log("OK attachment");
              this.expenseService.updateExpense(savedExpense.expenseId, savedExpense.title, savedExpense.expenseCategory, savedExpense.centValue, savedExpense.expenseTimerange, savedExpense.paymentDate, savedExpense.information, true, this.attachmentPath, this.attachmentName, this.attachmentType).subscribe(() => {
                console.log("OK UPDATE ATTACHMENT!!!");
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
      this.translateService.get(['messages.expenseAddExpenseOK1']).subscribe(translations => {
        this.messageService.add({ severity: 'success', summary: 'OK', detail: translations['messages.expenseAddExpenseOK1'] });
      });
      this.loadExpenses();
    }, (err) => {
      console.log(err);
      this.translateService.get(['messages.expenseAddExpenseError2']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expenseAddExpenseError2'] });
      });
    });
  }

  addExpenseCategory() {
    console.log("SHOW EXPEsaveExpenseCategory 1 !!!");

    if (this.newCategoryName.trim() !== "") {
      console.log("SHOW EXPEsaveExpenseCategory 2 !!!");
      this.expenseCategoryService.saveExpenseCategory(this.newCategoryName).subscribe(
        (savedExpenseCategory: ExpenseCategory) => {
          console.log("EXPEsaveExpenseCategory OK !!!");
          this.translateService.get(['messages.expensesTableAddCategoryOK1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: translations['messages.expensesTableAddCategoryOK1'] });
          });
          this.expenseBudgetService.saveExpenseBudget(savedExpenseCategory, 0, 0, 0, "", "");
          this.loadExpenseCategories();
        }, err => {
          console.log("EXPEsaveExpenseCategory ERROR !!!");
          this.translateService.get(['messages.expensesTableAddCategoryError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expensesTableAddCategoryError1'] });
          });
          this.loadExpenseCategories();
        });
    } else {
      this.translateService.get(['messages.expensesTableAddCategoryError2']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expensesTableAddCategoryError2'] });
      });
    }
  }

  onExpenseAttachmentUpload(event) {
    const attachmentFiles: FileList = event.target.files;

    if (attachmentFiles != null && attachmentFiles.length > 0) {
      console.log("attach ");
      console.log(attachmentFiles[0]);
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
        () => { },
        err => {
          console.log(err);
          this.translateService.get(['messages.expensesEditCategoryError2']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expensesEditCategoryError2'] });
          });
        });
    } else {
      this.translateService.get(['messages.expensesEditCategoryError1']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expensesEditCategoryError1'] });
      });
    }
  }

  updateExpenseAttachment() {
    let parsedUpdatedAttachmentId = parseInt(this.updatedAttachmentId);

    if (parsedUpdatedAttachmentId === null || parsedUpdatedAttachmentId === Number.NaN || parsedUpdatedAttachmentId === 0) {
      this.translateService.get(['messages.expensesupdatedAttachmentError1']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expensesupdatedAttachmentError1'] });
      });
      return;
    }

    if (this.attachmentFile != undefined && this.attachmentFile != null) {
      if (this.attachmentFile.name != null) {
        this.attachmentName = "" + parsedUpdatedAttachmentId;
        this.attachmentPath = this.attachmentName + "." + this.attachmentType;
        this.expenseService.addExpenseAttachment(parsedUpdatedAttachmentId, this.attachmentType, this.attachmentFile).subscribe(
          () => {
            this.translateService.get(['messages.expensesupdatedAttachmentOk1']).subscribe(translations => {
              this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expensesupdatedAttachmentOk1'] });
            });
          },
          (err) => {
            this.translateService.get(['messages.expensesupdatedAttachmentError3']).subscribe(translations => {
              this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expensesupdatedAttachmentError3'] });
            });
          });
      }
    } else {
      this.translateService.get(['messages.expensesupdatedAttachmentError2']).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: translations['messages.expensesupdatedAttachmentError2'] });
      });
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.tableColumns, this.expenses);
        doc.save('products.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.expenses);
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
