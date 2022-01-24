import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faFont, faTags, faInfo, faTable, faPlusCircle, faCheckSquare, faPlus, faFolderPlus, faArrowRight, faRetweet, faPaperclip, faUndo, faUserAlt, faCalendarAlt, faBarcode, faLink } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { MessageCreator } from 'src/app/util/messageCreator';
import { MusicGenre } from '../model/music-genre.model';
import { MusicTable } from '../model/music-table.model';
import { Music } from '../model/music.model';
import { MusicGenreService } from '../music-genre.service';
import { MusicService } from '../music.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {

  standardTableWidth = 1584;

  readonly deleteCacheStorageId = "app32xMusicDeleted";

  loading: boolean;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  musicItems: MusicTable[];
  musicItemsLength: number = 0;

  musicGenres: MusicGenre[];
  musicGenresTitles: string[];

  //new music data
  interpreter: string;
  songTitle: string;
  musicGenre: MusicGenre;
  yearDate: number;
  codeValue: string;
  linkValue: String;
  notice: string;

  newMusicGenreName: string;
  editSelectedMusicGenre: MusicGenre;
  updatedMusicGenre: MusicGenre;

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
  faUserAlt = faUserAlt;
  faCalendarAlt = faCalendarAlt;
  faBarcode = faBarcode;
  faLink = faLink;

  @ViewChild('genreselector') genreselector: ElementRef;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private messageCreator: MessageCreator, private messageService: MessageService, private apiConfig: ApiConfig, private musicService: MusicService, private musicGenreService: MusicGenreService, private translateService: TranslateService) {

  }

  /**
     * Load books and table header translations
     */
  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['music.musicAddInterpreterHeader', 'music.musicAddSongTitleHeader', 'music.musicAddYearHeader', 'music.musicAddGenreHeader', 'music.musicAddCodeHeader', 'music.musicAddLinkHeader', 'music.musicAddNoticeHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'musicId', header: 'ID' },
        { field: 'interpreter', header: translations['music.musicAddInterpreterHeader'] },
        { field: 'songtitle', header: translations['music.musicAddSongTitleHeader'] },
        { field: 'yearDate', header: translations['music.musicAddYearHeader'] },
        { field: 'musicGenre', header: translations['music.musicAddGenreHeader'] },
        { field: 'codeValue', header: translations['music.musicAddCodeHeader'] },
        { field: 'linkValue', header: translations['music.musicAddLinkHeader'] },
        { field: 'notice', header: translations['music.musicAddNoticeHeader'] }
      ];
      this.exportColumns = [
        { field: 'musicId', header: 'ID' },
        { field: 'interpreter', header: translations['music.musicAddInterpreterHeader'] },
        { field: 'songtitle', header: translations['music.musicAddSongTitleHeader'] },
        { field: 'yearDate', header: translations['music.musicAddYearHeader'] },
        { field: 'musicGenre', header: translations['music.musicAddGenreHeader'] },
        { field: 'codeValue', header: translations['music.musicAddCodeHeader'] },
        { field: 'linkValue', header: translations['music.musicAddLinkHeader'] },
        { field: 'notice', header: translations['music.musicAddNoticeHeader'] }
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadMusicGenres();
    this.loadMusic();
    this.loadInputEnterListener();
  }

  ngAfterViewInit() {
    this.loadDropdownStyle();
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }

  loadDropdownStyle() {
    if (this.genreselector) {
      this.genreselector.nativeElement.querySelector(".p-dropdown-label").style.fontSize = "20px";
      this.genreselector.nativeElement.querySelector(".p-dropdown-label").style.margin = "auto";
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
   * Load music and create music array to display in the table. 
   */
  loadMusic() {
    this.musicService.getAllMusicTable().subscribe((data: Music[]) => {
      this.musicItems = [];
      data.forEach(
        (musicItem: Music) => {
          this.musicItems.push({ musicId: musicItem.musicId, interpreter: musicItem.interpreter, songtitle: musicItem.songtitle, yearDate: musicItem.yearDate, musicGenre: musicItem.musicGenre.genreTitle, codeValue: musicItem.codeValue, linkValue: musicItem.linkValue, notice: musicItem.notice });
        });
      this.musicItemsLength = this.musicItems.length;
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  /**
   * Create array for music genres. Create array of titles of music genres, which is needed for the music genre update of a music item. 
   */
  loadMusicGenres() {
    this.musicGenreService.getAllMusicGenre().subscribe((data: MusicGenre[]) => {
      this.musicGenres = data;
      this.musicGenresTitles = [];
      this.musicGenres.forEach((musicGenreItem) => {
        this.musicGenresTitles.push(musicGenreItem.genreTitle);
      });
    }, err => {
    });
  }

  /**
   * Reload music data
   */
  reloadAllMusicData() {
    this.loadMusic();
  }

  /**
   * Delete music item and save deleted music in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteMusic(id) {
    this.musicService.deleteMusic(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.musicDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.musicDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllMusicData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.musicDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.musicDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.musicDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.musicDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedMusic() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.musicService.restoreDeletedMusic(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllMusicData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('musicRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('musicRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a music row item. 
   * @param newValue 
   * @param musicItem 
   * @param columnName The column / attribute of the music item that will be updated
   */
  updateMusicValue(newValue, musicItem, columnName) {
    //Load objects through the title
    let musicGenreObject = this.getMusicGenreByGenreTitle(musicItem.musicGenre);

    if (columnName === "interpreter") {
      this.musicService.updateMusicTable(musicItem.musicId, newValue, musicItem.songtitle, musicItem.yearDate, musicGenreObject, musicItem.codeValue, musicItem.linkValue, musicItem.notice).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('musicTableUpdatedError1');
      });
    }
    else if (columnName === "songtitle") {
      this.musicService.updateMusicTable(musicItem.musicId, musicItem.interpreter, newValue, musicItem.yearDate, musicGenreObject, musicItem.codeValue, musicItem.linkValue, musicItem.notice).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('musicTableUpdatedError1');
      });
    }
    else if (columnName === "yearDate") {
      this.musicService.updateMusicTable(musicItem.musicId, musicItem.interpreter, musicItem.songtitle, newValue, musicGenreObject, musicItem.codeValue, musicItem.linkValue, musicItem.notice).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('musicTableUpdatedError1');
      });
    }
    else if (columnName === "musicGenre") {
      musicGenreObject = this.getMusicGenreByGenreTitle(newValue);
      this.musicService.updateMusicTable(musicItem.musicId, musicItem.interpreter, musicItem.songtitle, musicItem.yearDate, musicGenreObject, musicItem.codeValue, musicItem.linkValue, musicItem.notice).subscribe((res: String) => {
        this.loadMusic();
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('musicTableUpdatedError1');
      });
    }
    else if (columnName === "codeValue") {
      this.musicService.updateMusicTable(musicItem.musicId, musicItem.interpreter, musicItem.songtitle, musicItem.yearDate, musicGenreObject, newValue, musicItem.linkValue, musicItem.notice).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('musicTableUpdatedError1');
      });
    }
    else if (columnName === "linkValue") {
      this.musicService.updateMusicTable(musicItem.musicId, musicItem.interpreter, musicItem.songtitle, musicItem.yearDate, musicGenreObject, musicItem.codeValue, newValue, musicItem.notice).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('musicTableUpdatedError1');
      });
    }
    else if (columnName === "notice") {
      this.musicService.updateMusicTable(musicItem.musicId, musicItem.interpreter, musicItem.songtitle, musicItem.yearDate, musicGenreObject, musicItem.codeValue, musicItem.linkValue, newValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('musicTableUpdatedError1');
      });
    }
  }

  getMusicGenreByGenreTitle(musicGenreTitle) {
    return this.musicGenres.map(musicGenreItem => {
      if (musicGenreItem.genreTitle === musicGenreTitle) {
        return musicGenreItem;
      }
    }).filter(selectedMusicGenre => { return selectedMusicGenre })[0];
  }

  saveMusic() {
    if (this.songTitle === null || typeof this.songTitle === undefined || this.songTitle.trim() === "") {
      this.messageCreator.showErrorMessage('musicAddMusicError1');
      return;
    }

    if (this.musicGenre === null || typeof this.musicGenre === undefined) {
      this.messageCreator.showErrorMessage('musicAddMusicError4');
      return;
    }

    this.musicService.saveMusic(this.interpreter, this.songTitle, this.yearDate, this.musicGenre, this.codeValue, this.linkValue, this.notice).subscribe((savedMusic: Music) => {
      this.messageCreator.showSuccessMessage('musicAddMusicOK1');
      this.reloadAllMusicData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('musicAddMusicError4');
    });
  }

  addMusicGenre() {
    if (this.newMusicGenreName.trim() !== "") {
      this.musicGenreService.saveMusicGenre(this.newMusicGenreName).subscribe(
        () => {
          this.messageCreator.showSuccessMessage('musicTableAddGenreOK1');
          this.loadMusicGenres();
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage('musicTableAddGenreError1');
          this.loadMusicGenres();
        });
    } else {
      this.messageCreator.showErrorMessage('musicTableAddGenreError2');
    }
  }

  updateMusicGenres() {
    if (this.editSelectedMusicGenre != null) {
      this.musicService.updateGenresOfMusic(this.editSelectedMusicGenre.musicgenreId, this.updatedMusicGenre.musicgenreId).subscribe(
        () => {
          this.loadMusic();
          this.loadMusicGenres();
          this.messageCreator.showSuccessMessage("musicEditGenreOK1");
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage('musicEditGenreError2');
        });
    } else {
      this.messageCreator.showErrorMessage('musicEditGenreError1');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.musicItems);
        doc.save('music.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.musicItems);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "music");
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
    this.loadMusic();
  }

}
