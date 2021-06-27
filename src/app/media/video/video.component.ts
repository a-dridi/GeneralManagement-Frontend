import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fa500px } from '@fortawesome/free-brands-svg-icons';
import { faFont, faTags, faTable, faPlusCircle, faCheckSquare, faPlus, faFolderPlus, faArrowRight, faRetweet, faPaperclip, faUndo, faCalendarDay, faGlobe, faHome, faRulerVertical, faAtlas, faLink, faClone } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
import { MessageCreator } from 'src/app/util/messageCreator';
import { VideoGenre } from '../model/video-genre.model';
import { VideoLanguage } from '../model/video-language.model';
import { VideoTable } from '../model/video-table.model';
import { Video } from '../model/video.model';
import { VideoGenreService } from '../video-genre.service';
import { VideoLanguageService } from '../video-language.service';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  standardTableWidth = 1984;

  readonly deleteCacheStorageId = "app32xVideosDeleted";

  loading: boolean;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  videos: VideoTable[];

  videoLanguages: VideoLanguage[];
  videoLanguageTitles: string[];
  videoGenres: VideoGenre[];
  videoGenreTitles: string[];

  //new video data
  title: string;
  isOwnProduction: boolean = false;
  videoLanguage: VideoLanguage;
  isHd: boolean = true;
  videoGenre: VideoGenre;
  durationLength: number;
  yearDate: number;
  isSeries: boolean = false;
  nativeTitle: string;
  linkValue: string;

  newLanguageName: string;
  newGenreName: string;
  editSelectedVideoLanguage: VideoLanguage;
  updatedVideoLanguage: VideoLanguage;
  editSelectedVideoGenre: VideoGenre;
  updatedVideoGenre: VideoGenre;

  faFont = faFont;
  faTags = faTags;
  faGlobe = faGlobe;
  faHome = faHome;
  fa500px = fa500px;
  faRulerVertical = faRulerVertical;
  faAtlas=faAtlas;
  faLink = faLink;
  faClone = faClone;
  faTable = faTable;
  faPlusCircle = faPlusCircle;
  faCheckSquare = faCheckSquare;
  faPlus = faPlus;
  faFolderPlus = faFolderPlus;
  faArrowRight = faArrowRight;
  faRetweet = faRetweet;
  faPaperclip = faPaperclip;
  faUndo = faUndo;
  faCalendarDay = faCalendarDay;

  @ViewChild('languageselector') languageselector: ElementRef;
  @ViewChild('genreselector') genreselector: ElementRef;

  constructor(private cssStyleAdjustment: CssStyleAdjustment, private messageCreator: MessageCreator, private messageService: MessageService, private apiConfig: ApiConfig, private videoService: VideoService, private videoLanguageService: VideoLanguageService, private videoGenreService: VideoGenreService, private translateService: TranslateService) {

  }

  /**
     * Load video and table header translations
     */
  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['video.videoAddTitleHeader', 'video.videoAddIsOwnProductionHeader', 'video.videoAddVideoLanguageHeader', 'video.videoAddIsHdHeader', 'video.videoAddVideoGenreHeader', 'video.videoAddDurationLengthHeader', 'video.videoAddYearHeader', 'video.videoAddIsSeriesHeader', 'video.videoAddNativeTitleHeader', 'video.videoAddLinkValueHeader']).subscribe(translations => {
      this.tableColumns = [
        { field: 'videoId', header: 'ID' },
        { field: 'title', header: translations['video.videoAddTitleHeader'] },
        { field: 'isOwnProduction', header: translations['video.videoAddIsOwnProductionHeader'] },
        { field: 'videoLanguage', header: translations['video.videoAddVideoLanguageHeader'] },
        { field: 'isHd', header: translations['video.videoAddIsHdHeader'] },
        { field: 'videoGenre', header: translations['video.videoAddVideoGenreHeader'] },
        { field: 'durationLength', header: translations['video.videoAddDurationLengthHeader'] },
        { field: 'yearDate', header: translations['video.videoAddYearHeader'] },
        { field: 'isSeries', header: translations['video.videoAddIsSeriesHeader'] },
        { field: 'nativeTitle', header: translations['video.videoAddNativeTitleHeader'] },
        { field: 'linkValue', header: translations['video.videoAddLinkValueHeader'] },
      ];
      this.exportColumns = [
        { field: 'videoId', header: 'ID' },
        { field: 'title', header: translations['video.videoAddTitleHeader'] },
        { field: 'isOwnProduction', header: translations['video.videoAddIsOwnProductionHeader'] },
        { field: 'videoLanguage', header: translations['video.videoAddVideoLanguageHeader'] },
        { field: 'isHd', header: translations['video.videoAddIsHdHeader'] },
        { field: 'videoGenre', header: translations['video.videoAddVideoGenreHeader'] },
        { field: 'durationLength', header: translations['video.videoAddDurationLengthHeader'] },
        { field: 'yearDate', header: translations['video.videoAddYearHeader'] },
        { field: 'isSeries', header: translations['video.videoAddIsSeriesHeader'] },
        { field: 'nativeTitle', header: translations['video.videoAddNativeTitleHeader'] },
        { field: 'linkValue', header: translations['video.videoAddLinkValueHeader'] },
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );
    this.loadVideoLanguages();
    this.loadVideoGenres();
    this.loadVideos();
    this.loadInputEnterListener();
  }

  ngAfterViewInit() {
    this.loadDropdownStyle();
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }

  loadDropdownStyle() {
    if (this.languageselector) {
      this.languageselector.nativeElement.querySelector(".p-dropdown-label").style.fontSize = "20px";
      this.languageselector.nativeElement.querySelector(".p-dropdown-label").style.margin = "auto";
    }
    if (this.genreselector) {
      this.genreselector.nativeElement.querySelector(".p-dropdown-label").style.fontSize = "20px";
      this.genreselector.nativeElement.querySelector(".p-dropdown-label").style.margin = "auto";
    }
  }

  /**
   * Submit input value when user enters "Enter".
   */
  loadInputEnterListener() {
    //Add Language
    let addCategoryInput = document.getElementById("addLanguageTitle");
    addCategoryInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addLanguageButton").click();
      }
    });

    //Add Genre
    let addAvailabilityInput = document.getElementById("addGenreTitle");
    addAvailabilityInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addGenreButton").click();
      }
    });
  }

  reloadDropdown(event) {
    setTimeout(() => { this.loadDropdownStyle(); }, 100);
    this.loadDropdownStyle();
  }

  /**
   * Load video and create videos array to display in the table. 
   */
  loadVideos() {
    this.videos = [];

    this.videoService.getAllVideoTable().subscribe((data: Video[]) => {
      data.forEach(
        (videoItem: Video) => {
          this.videos.push({ videoId: videoItem.videoId, title: videoItem.title, isOwnProduction: videoItem.isOwnProduction, videoLanguage: videoItem.videoLanguage.languageTitle, isHd: videoItem.isHd, videoGenre: videoItem.videoGenre.genreTitle, durationLength: videoItem.durationLength, yearDate: videoItem.yearDate, isSeries: videoItem.isSeries, nativeTitle: videoItem.nativeTitle, linkValue: videoItem.linkValue });
        });
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  /**
   * Create array for languages. Create array of titles of languages, which is needed for the language update of a video item. 
   */
  loadVideoLanguages() {
    this.videoLanguageService.getAllVideoLanguage().subscribe((data: VideoLanguage[]) => {
      this.videoLanguages = data;
      this.videoLanguageTitles = [];
      this.videoLanguages.forEach((videoLanguageItem) => {
        this.videoLanguageTitles.push(videoLanguageItem.languageTitle);
      });
    }, err => {
    });
  }

  /**
 * Create array for genres. Create array of titles of genres, which is needed for the genres update of a video item. 
 */
  loadVideoGenres() {
    this.videoGenreService.getAllVideoGenre().subscribe((data: VideoGenre[]) => {
      this.videoGenres = data;
      this.videoGenreTitles = [];
      this.videoGenres.forEach((videoGenreItem) => {
        this.videoGenreTitles.push(videoGenreItem.genreTitle);
      });
    }, err => {
    });
  }

  /**
   * Reload video data
   */
  reloadAllVideoData() {
    this.loadVideos();
  }

  /**
   * Delete video item and save deleted video in cache to give the user the posibility to restore the deleted item/s. 
   * @param id 
   */
  deleteVideo(id) {
    this.videoService.deleteVideo(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.videoDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.videoDeletedOk1']).replace('#?', id) });
        });
        if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
          localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
        } else {
          localStorage.setItem(this.deleteCacheStorageId, (id));
        }
        this.reloadAllVideoData();
      }, err => {
        if (err.status !== 200) {
          this.translateService.get(['messages.videoDeletedError1']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: (translations['messages.videoDeletedError1']).replace('#?', id) });
          });
        } else {
          this.translateService.get(['messages.videoDeletedOk1']).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.videoDeletedOk1']).replace('#?', id) });
          });
          if (localStorage.getItem(this.deleteCacheStorageId) !== null && localStorage.getItem(this.deleteCacheStorageId) !== "") {
            localStorage.setItem(this.deleteCacheStorageId, (localStorage.getItem(this.deleteCacheStorageId) + ";" + id));
          } else {
            localStorage.setItem(this.deleteCacheStorageId, (id));
          }
        }
      });
  }

  restoreDeletedVideos() {
    let deletedIdsString = localStorage.getItem(this.deleteCacheStorageId);
    if (deletedIdsString !== null && deletedIdsString !== "") {
      let deletedIdsArray = deletedIdsString.split(";");
      let restoredSuccessfulNumber = 0;
      deletedIdsArray.forEach((deletedItemId) => {
        this.videoService.restoreDeletedVideo(deletedItemId).subscribe(
          () => {
            restoredSuccessfulNumber++;
            if (restoredSuccessfulNumber === deletedIdsArray.length) {
              this.reloadAllVideoData();
              localStorage.setItem(this.deleteCacheStorageId, "");
              this.messageCreator.showSuccessMessage('videoRestoreDeletedOK1');
            }
          }, err => {
            this.messageCreator.showErrorMessage('videoRestoreDeletedError1');
          }
        );
      });
    }
  }

  /**
   * Update row value for a Video row item. 
   * @param newValue 
   * @param videoItem 
   * @param columnName The column / attribute of the book item that will be updated
   */
  updateVideoValue(newValue, videoItem, columnName) {
    //Load objects through the title
    let videoLanguageObject = this.getVideoLanguageByLanguageTitle(videoItem.videoLanguage);
    let videoGenreObject = this.getVideoGenreByGenreTitle(videoItem.videoGenre);

    if (columnName === "title") {
      this.videoService.updateVideoTable(videoItem.videoId, newValue, videoItem.isOwnProduction, videoLanguageObject, videoItem.isHd, videoGenreObject, videoItem.durationLength, videoItem.yearDate, videoItem.isSeries, videoItem.nativeTitle, videoItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoTableUpdatedError1');
      });
    }
    else if (columnName === "isOwnProduction") {
      this.videoService.updateVideoTable(videoItem.videoId, videoItem.title, newValue, videoLanguageObject, videoItem.isHd, videoGenreObject, videoItem.durationLength, videoItem.yearDate, videoItem.isSeries, videoItem.nativeTitle, videoItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoTableUpdatedError1');
      });
    }
    else if (columnName === "videoLanguage") {
      videoLanguageObject = this.getVideoLanguageByLanguageTitle(newValue);
      this.videoService.updateVideoTable(videoItem.videoId, videoItem.title, videoItem.isOwnProduction, videoLanguageObject, videoItem.isHd, videoGenreObject, videoItem.durationLength, videoItem.yearDate, videoItem.isSeries, videoItem.nativeTitle, videoItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoTableUpdatedError1');
      });
    }
    else if (columnName === "isHd") {
      this.videoService.updateVideoTable(videoItem.videoId, videoItem.title, videoItem.isOwnProduction, videoLanguageObject, newValue, videoGenreObject, videoItem.durationLength, videoItem.yearDate, videoItem.isSeries, videoItem.nativeTitle, videoItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoTableUpdatedError1');
      });
    }
    else if (columnName === "videoGenre") {
      videoGenreObject = this.getVideoGenreByGenreTitle(newValue);
      this.videoService.updateVideoTable(videoItem.videoId, videoItem.title, videoItem.isOwnProduction, videoLanguageObject, videoItem.isHd, videoGenreObject, videoItem.durationLength, videoItem.yearDate, videoItem.isSeries, videoItem.nativeTitle, videoItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoTableUpdatedError1');
      });
    }
    else if (columnName === "durationLength") {
      this.videoService.updateVideoTable(videoItem.videoId, videoItem.title, videoItem.isOwnProduction, videoLanguageObject, videoItem.isHd, videoGenreObject, newValue, videoItem.yearDate, videoItem.isSeries, videoItem.nativeTitle, videoItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoTableUpdatedError1');
      });
    }
    else if (columnName === "yearDate") {
      this.videoService.updateVideoTable(videoItem.videoId, videoItem.title, videoItem.isOwnProduction, videoLanguageObject, videoItem.isHd, videoGenreObject, videoItem.durationLength, newValue, videoItem.isSeries, videoItem.nativeTitle, videoItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoTableUpdatedError1');
      });
    }
    else if (columnName === "isSeries") {
      this.videoService.updateVideoTable(videoItem.videoId, videoItem.title, videoItem.isOwnProduction, videoLanguageObject, videoItem.isHd, videoGenreObject, videoItem.durationLength, videoItem.yearDate, newValue, videoItem.nativeTitle, videoItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoTableUpdatedError1');
      });
    }
    else if (columnName === "nativeTitle") {
      this.videoService.updateVideoTable(videoItem.videoId, videoItem.title, videoItem.isOwnProduction, videoLanguageObject, videoItem.isHd, videoGenreObject, videoItem.durationLength, videoItem.yearDate, videoItem.isSeries, newValue, videoItem.linkValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoTableUpdatedError1');
      });
    }
    else if (columnName === "linkValue") {
      this.videoService.updateVideoTable(videoItem.videoId, videoItem.title, videoItem.isOwnProduction, videoLanguageObject, videoItem.isHd, videoGenreObject, videoItem.durationLength, videoItem.yearDate, videoItem.isSeries, videoItem.nativeTitle, newValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('videoTableUpdatedError1');
      });
    }
  }

  getVideoLanguageByLanguageTitle(videoLanguageTitle) {
    return this.videoLanguages.map(videoLanguageItem => {
      if (videoLanguageItem.languageTitle === videoLanguageTitle) {
        return videoLanguageItem;
      }
    }).filter(selectedVideoLanguage => { return selectedVideoLanguage })[0];
  }

  getVideoGenreByGenreTitle(videoGenreTitle) {
    return this.videoGenres.map(videoGenreItem => {
      if (videoGenreItem.genreTitle === videoGenreTitle) {
        return videoGenreItem;
      }
    }).filter(selectedVideoGenre => { return selectedVideoGenre })[0];
  }

  saveVideo() {

console.log("save")
console.log(this.title)
console.log(this.linkValue)

    if (this.title === null || typeof this.title === undefined || this.title.trim() === "") {
      this.messageCreator.showErrorMessage('videoAddVideoError1');
      return;
    }

    if (this.videoLanguage === null || typeof this.videoLanguage === undefined) {
      this.messageCreator.showErrorMessage('videoAddVideoError2');
      return;
    }

    if (this.videoGenre === null || typeof this.videoGenre === undefined) {
      this.messageCreator.showErrorMessage('videoAddVideoError3');
      return;
    }

    if (typeof this.linkValue === undefined || this.linkValue.trim() == undefined || this.linkValue.trim() === "" ) {
      this.messageCreator.showErrorMessage('videoAddVideoError5');
      return;
    }


    this.videoService.saveVideo(this.title, this.isOwnProduction, this.videoLanguage, this.isHd, this.videoGenre, this.durationLength, this.yearDate, this.isSeries, this.nativeTitle, this.linkValue).subscribe((savedVideo: Video) => {
      this.messageCreator.showSuccessMessage('videoAddVideoOK1');
      this.reloadAllVideoData();
    }, (err) => {
      console.log(err);
      this.messageCreator.showErrorMessage('videoAddVideoError4');
    });
  }

  addVideoLanguage() {
    if (this.newLanguageName.trim() !== "") {
      this.videoLanguageService.saveVideoLanguage(this.newLanguageName).subscribe(
        () => {
          this.messageCreator.showSuccessMessage('videoTableAddLanguageOK1');
          this.loadVideoLanguages();
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage('videoTableAddLanguageError1');
          this.loadVideoLanguages();
        });
    } else {
      this.messageCreator.showErrorMessage('videoTableAddLanguageError2');
    }
  }

  addVideoGenre() {
    if (this.newGenreName.trim() !== "") {
      this.videoGenreService.saveVideoGenre(this.newGenreName).subscribe(
        () => {
          this.messageCreator.showSuccessMessage('videoTableAddGenreOK1');
          this.loadVideoGenres();
        }, err => {
          console.log(err);
          this.messageCreator.showErrorMessage('videoTableAddGenreError1');
          this.loadVideoGenres();
        });
    } else {
      this.messageCreator.showErrorMessage('videoTableAddGenreError2');
    }
  }

  updateLanguages() {
    if (this.editSelectedVideoLanguage != null) {
      this.videoService.updateVideoLanguagesOfVideos(this.editSelectedVideoLanguage.videolanguageId, this.updatedVideoLanguage.videolanguageId).subscribe(
        () => {
          this.loadVideoLanguages();
          this.loadVideos();
          this.messageCreator.showSuccessMessage("videoEditLanguageOk1");
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage('videoEditLanguageError2');
        });
    } else {
      this.messageCreator.showErrorMessage('videoEditLanguageError2');
    }
  }

  updateGenres() {
    if (this.editSelectedVideoGenre != null) {
      this.videoService.updateVideoGenresOfVideos(this.editSelectedVideoGenre.videogenreId, this.updatedVideoGenre.videogenreId).subscribe(
        () => {
          this.loadVideoGenres();
          this.loadVideos();
          this.messageCreator.showSuccessMessage("videoEditGenreOk1");
        },
        err => {
          console.log(err);
          this.messageCreator.showErrorMessage('videoEditGenreError2');
        });
    } else {
      this.messageCreator.showErrorMessage('videoEditGenreError1');
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.videos);
        doc.save('videos.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.videos);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "videos");
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
    this.loadVideos();
  }

}
