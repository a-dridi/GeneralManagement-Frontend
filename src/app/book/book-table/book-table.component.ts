import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faArrowRight, faBarcode, faCalendarDay, faCheckSquare, faFolderPlus, faFont, faGlobeAmericas, faInfo, faPaperclip, faPlus, faPlusCircle, faRetweet, faSearchLocation, faSignal, faTable, faTags, faUndo } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { MessageCreator } from 'src/app/util/messageCreator';
import { BookAvailabilityService } from '../book-availability.service';
import { BookCategoryService } from '../book-category.service';
import { BookService } from '../book.service';
import { BookAvailability } from '../model/book-availability.model';
import { BookCategory } from '../model/book-category.model';
import { BookTable } from '../model/book-table.model';
import { Book } from '../model/book.model';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.scss']
})
export class BookTableComponent implements OnInit {

  standardTableWidth = 1584;

  readonly deleteCacheStorageId = "app32xBooksDeleted";

  loading: boolean;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  books: BookTable[];
  booksLength: number = 0;

  bookCategories: BookCategory[];
  bookCategoryTitles: string[];
  bookAvailabilities: BookAvailability[];
  bookAvailabilityTitles: string[];

  //new book data
  title: string;
  bookCategory: BookCategory;
  location: String;
  bookAvailability: string;
  language: string;
  year: string;
  isbn: string;
  information: string;
  addedDate: Date = new Date();

  newCategoryName: string;
  newAvailabilityName: string;
  editSelectedBookCategory: BookCategory;
  updatedBookCategory: BookCategory;
  editSelectedBookAvailability: BookAvailability;
  updatedBookAvailability: BookAvailability;

  faFont = faFont;
  faTags = faTags;
  faGlobeAmericas = faGlobeAmericas;
  faBarcode = faBarcode;
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
  faCalendarDay=faCalendarDay;

  @ViewChild('categoryselector') categoryselector: ElementRef;
  @ViewChild('availabilityselector') availabilityselector: ElementRef;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private messageCreator: MessageCreator, private messageService: MessageService, private apiConfig: ApiConfig, private bookService: BookService, private bookCategoryService: BookCategoryService, private bookAvailabilityService: BookAvailabilityService, private translateService: TranslateService) {

  }

  /**
     * Load books and table header translations
     */
  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['book.bookAddTitleHeader', 'book.bookAddCategoryHeader', 'book.bookAddLocationHeader', 'book.bookAddAvailabilityHeader', 'book.bookAddLanguageHeader', 'book.bookAddYearHeader', 'book.bookAddIsbnHeader', 'book.bookAddInformationHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'bookId', header: 'ID' },
        { field: 'title', header: translations['book.bookAddTitleHeader'] },
        { field: 'bookCategory', header: translations['book.bookAddCategoryHeader'] },
        { field: 'location', header: translations['book.bookAddLocationHeader'] },
        { field: 'bookAvailability', header: translations['book.bookAddAvailabilityHeader'] },
        { field: 'bookLanguage', header: translations['book.bookAddLanguageHeader'] },
        { field: 'yearDate', header: translations['book.bookAddYearHeader'] },
        { field: 'isbn', header: translations['book.bookAddIsbnHeader'] },
        { field: 'information', header: translations['book.bookAddInformationHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportColumns = [
        { field: 'bookId', header: 'ID' },
        { field: 'title', header: translations['book.bookAddTitleHeader'] },
        { field: 'bookCategory', header: translations['book.bookAddCategoryHeader'] },
        { field: 'location', header: translations['book.bookAddLocationHeader'] },
        { field: 'bookAvailability', header: translations['book.bookAddAvailabilityHeader'] },
        { field: 'bookLanguage', header: translations['book.bookAddLanguageHeader'] },
        { field: 'yearDate', header: translations['book.bookAddYearHeader'] },
        { field: 'isbn', header: translations['book.bookAddIsbnHeader'] },
        { field: 'information', header: translations['book.bookAddInformationHeader'] },
        { field: 'download', header: 'D' }
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadBookCategories();
    this.loadBookAvailabilities();
    this.loadBooks();
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

    if (this.availabilityselector) {
      this.availabilityselector.nativeElement.querySelector(".p-dropdown-label").style.fontSize = "20px";
      this.availabilityselector.nativeElement.querySelector(".p-dropdown-label").style.margin = "auto";
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

    //Add availability
    let addAvailabilityInput = document.getElementById("addAvailabilityTitle");
    addAvailabilityInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addAvailabilityButton").click();
      }
    });
  }

  reloadDropdown(event) {
    setTimeout(() => { this.loadDropdownStyle(); }, 100);
    this.loadDropdownStyle();
  }

  /**
   * Load books and create books array to display in the table. 
   */
  loadBooks() {
    this.bookService.getAllBookTable().subscribe((data: Book[]) => {
      this.books = [];
      data.forEach(
        (bookItem: Book) => {
          this.books.push({ bookId: bookItem.bookId, title: bookItem.title, bookCategory: bookItem.bookCategory.categoryTitle, location: bookItem.location, bookAvailability: bookItem.bookAvailability.availabilityTitle, bookLanguage: bookItem.bookLanguage, yearDate: bookItem.yearDate, isbn: bookItem.isbn, information: bookItem.information, addedDate: bookItem.addedDate });
        });
        this.booksLength = this.books.length;
      this.loading = false;
    }, err => {
      this.books = [];
      this.booksLength = 0;
      console.log(err);
      this.loading = false;
    });
  }

  /**
   * Create array for categories. Create array of titles of categories, which is needed for the category update of a book item. 
   */
  loadBookCategories() {
    this.bookCategoryService.getAllBookCategory().subscribe((data: BookCategory[]) => {
      this.bookCategories = data;
      this.bookCategoryTitles = [];
      this.bookCategories.forEach((bookCategoryItem) => {
        this.bookCategoryTitles.push(bookCategoryItem.categoryTitle);
      });
    }, err => {
    });
  }

  /**
 * Create array for availabilities. Create array of titles of availabilities, which is needed for the availabilities update of a book item. 
 */
  loadBookAvailabilities() {
    this.bookAvailabilityService.getAllBookAvailability().subscribe((data: BookAvailability[]) => {
      this.bookAvailabilities = data;
      this.bookAvailabilityTitles = [];
      this.bookAvailabilities.forEach((bookAvailabilityItem) => {
        this.bookAvailabilityTitles.push(bookAvailabilityItem.availabilityTitle);
      });
    }, err => {
    });
  }

  /**
   * Reload book data
   */
  reloadAllBookData() {
    this.loadBooks();
  }

  /**
   * Delete book item and save deleted book in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteBook(id) {
    this.bookService.deleteBook(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.bookDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.bookDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllBookData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.bookDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.bookDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.bookDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.bookDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedBooks() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.bookService.restoreDeletedBook(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllBookData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('bookRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('bookRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a Book row item. 
   * @param newValue 
   * @param bookItem 
   * @param columnName The column / attribute of the book item that will be updated
   */
  updateBookValue(newValue, bookItem, columnName) {
    //Load objects through the title
    let bookCategoryObject = this.getBookCategoryByCategoryTitle(bookItem.bookCategory);
    let bookAvailabilityObject = this.getBookAvailabilityByAvailabilityTitle(bookItem.bookAvailability);

    if (columnName === "title") {
      this.bookService.updateBookTable(bookItem.bookId, newValue, bookCategoryObject, bookItem.location, bookAvailabilityObject, bookItem.bookLanguage, bookItem.yearDate, bookItem.isbn, bookItem.information, bookItem.addedDate).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('booksTableUpdatedError1');
      });
    }
    else if (columnName === "category") {
      bookCategoryObject = this.getBookCategoryByCategoryTitle(newValue);
      this.bookService.updateBookTable(bookItem.bookId, bookItem.title, bookCategoryObject, bookItem.location, bookAvailabilityObject, bookItem.bookLanguage, bookItem.yearDate, bookItem.isbn, bookItem.information, bookItem.addedDate).subscribe((res: String) => {
        this.reloadAllBookData();
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('booksTableUpdatedError1');
      });
    }
    else if (columnName === "location") {
      this.bookService.updateBookTable(bookItem.bookId, bookItem.title, bookCategoryObject, newValue, bookAvailabilityObject, bookItem.bookLanguage, bookItem.yearDate, bookItem.isbn, bookItem.information, bookItem.addedDate).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('booksTableUpdatedError1');
      });
    }
    else if (columnName === "availability") {
      bookAvailabilityObject = this.getBookAvailabilityByAvailabilityTitle(newValue);
      this.bookService.updateBookTable(bookItem.bookId, bookItem.title, bookCategoryObject, bookItem.location, bookAvailabilityObject, bookItem.bookLanguage, bookItem.yearDate, bookItem.isbn, bookItem.information, bookItem.addedDate).subscribe((res: String) => {
        this.reloadAllBookData();
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('booksTableUpdatedError1');
      });
    }
    else if (columnName === "bookLanguage") {
      this.bookService.updateBookTable(bookItem.bookId, bookItem.title, bookCategoryObject, bookItem.location, bookAvailabilityObject, newValue, bookItem.yearDate, bookItem.isbn, bookItem.information, bookItem.addedDate).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('booksTableUpdatedError1');
      });
    }
    else if (columnName === "yearDate") {
      this.bookService.updateBookTable(bookItem.bookId, bookItem.title, bookCategoryObject, bookItem.location, bookAvailabilityObject, bookItem.bookLanguage, newValue, bookItem.isbn, bookItem.information, bookItem.addedDate).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('booksTableUpdatedError1');
      });
    }
    else if (columnName === "isbn") {
      this.bookService.updateBookTable(bookItem.bookId, bookItem.title, bookCategoryObject, bookItem.location, bookAvailabilityObject, bookItem.bookLanguage, bookItem.yearDate, newValue, bookItem.information, bookItem.addedDate).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('booksTableUpdatedError1');
      });
    }
    else if (columnName === "information") {
      this.bookService.updateBookTable(bookItem.bookId, bookItem.title, bookCategoryObject, bookItem.location, bookAvailabilityObject, bookItem.bookLanguage, bookItem.yearDate, bookItem.isbn, newValue, bookItem.addedDate).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('booksTableUpdatedError1');
      });
    }
  }

  getBookCategoryByCategoryTitle(bookCategoryTitle) {
    return this.bookCategories.map(bookCategoryItem => {
      if (bookCategoryItem.categoryTitle === bookCategoryTitle) {
        return bookCategoryItem;
      }
    }).filter(selectedBookCategory => { return selectedBookCategory })[0];
  }


  getBookAvailabilityByAvailabilityTitle(bookAvailabilityTitle) {
    return this.bookAvailabilities.map(bookAvailibilityItem => {
      if (bookAvailibilityItem.availabilityTitle === bookAvailabilityTitle) {
        return bookAvailibilityItem;
      }
    }).filter(selectedBookCategory => { return selectedBookCategory })[0];
  }

  saveBook() {
    if (this.title === null || typeof this.title === undefined || this.title.trim() === "") {
      this.messageCreator.showErrorMessage('bookAddBookError1');
      return;
    }

    if (this.bookCategory === null || typeof this.bookCategory === undefined) {
      this.messageCreator.showErrorMessage('bookAddBookError2');
      return;
    }

    if (this.bookAvailability === null || typeof this.bookAvailability === undefined) {
      this.messageCreator.showErrorMessage('bookAddBookError3');
      return;
    }

    if (typeof this.information === undefined || this.information === null) {
      this.information = "";
    }


    this.bookService.saveBook(this.title, this.bookCategory, this.location, this.bookAvailability, this.language, this.year, this.isbn, this.information, new Date()).subscribe((savedBook: Book) => {
      this.messageCreator.showSuccessMessage('bookAddBookOK1');
      this.reloadAllBookData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('bookAddBookError4');
    });
  }

  addBookCategory() {
    if (this.newCategoryName.trim() !== "") {
      this.bookCategoryService.saveBookCategory(this.newCategoryName).subscribe(
        () => {
          this.messageCreator.showSuccessMessage('booksTableAddCategoryOK1');
          this.loadBookCategories();
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage('booksTableAddCategoryError1');
          this.loadBookCategories();
        });
    } else {
      this.messageCreator.showErrorMessage('booksTableAddCategoryError2');
    }
  }

  addBookAvailability() {
    if (this.newAvailabilityName.trim() !== "") {
      this.bookAvailabilityService.saveBookAvailability(this.newAvailabilityName).subscribe(
        () => {
          this.messageCreator.showSuccessMessage('booksTableAddAvailabilityOK1');
          this.loadBookAvailabilities();
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage('booksTableAddAvailabilityError1');
          this.loadBookAvailabilities();
        });
    } else {
      this.messageCreator.showErrorMessage('booksTableAddAvailabilityError2');
    }
  }

  updateCategories() {
    if (this.editSelectedBookCategory != null) {
      this.bookService.updateBookCategoriesOfBooks(this.editSelectedBookCategory.bookCategoryId, this.updatedBookCategory.bookCategoryId).subscribe(
        () => {
          this.loadBooks();
          this.loadBookCategories();
          this.messageCreator.showSuccessMessage("booksEditCategoryOk1");
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage('booksEditCategoryError2');
        });
    } else {
      this.messageCreator.showErrorMessage('booksEditCategoryError1');
    }
  }


  updateAvailabilities() {
    if (this.editSelectedBookAvailability != null) {
      this.bookService.updateBookCategoriesOfBooks(this.editSelectedBookAvailability.bookAvailibilityId, this.updatedBookAvailability.bookAvailibilityId).subscribe(
        () => {
          this.loadBooks();
          this.loadBookAvailabilities();
          this.messageCreator.showSuccessMessage("booksEditAvailabilityOk1");
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage('booksEditAvailabilityError2');
        });
    } else {
      this.messageCreator.showErrorMessage('booksEditAvailabilityError1');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.books);
        doc.save('books.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.books);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "books");
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

  /**
   * Recreate original table object
   */
  resetExportTableData() {
    this.loadBooks();
  }

}
