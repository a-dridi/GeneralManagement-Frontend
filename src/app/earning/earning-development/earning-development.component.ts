import { Component, OnInit } from '@angular/core';
import { faChartArea, faTable } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { EarningDevelopment } from 'src/app/earning/model/earning-development';
import { UserSettingsService } from 'src/app/user-settings.service';
import { UserSetting } from 'src/app/user/model/user-setting.model';
import { AppLanguageLoaderHelper } from 'src/app/util/languages.config';
import { MessageCreator } from 'src/app/util/messageCreator';
import { EarningDevelopmentService } from '../earning-development.service';

@Component({
  selector: 'app-earning-development',
  templateUrl: './earning-development.component.html',
  styleUrls: ['./earning-development.component.scss']
})
export class EarningDevelopmentComponent implements OnInit {
  //Settings
  selectedCurrency: string = "USD";

  localeOfUser: string = "en";
  monthlyLoading: boolean;
  monthlyTableColumns: any[];
  monthlyExportColumns: any[];
  monthlyExportedColumns: any[];

  yearlyLoading: boolean;
  yearlyTableColumns: any[];
  yearlyExportColumns: any[];
  yearlyExportedColumns: any[];

  monthlyChartTitle: string;
  monthlyEarningDevelopments: EarningDevelopment[];
  monthlyEarningDevelopmentsLength: number = 0;
  monthlyEarningDevelopmentGraph: any;
  monthlyGraphOptions: any;

  yearlyChartTitle: string;
  yearlyEarningDevelopments: EarningDevelopment[];
  yearlyEarningDevelopmentsLength: number = 0;
  yearlyEarningDevelopmentGraph: any;
  yearlyGraphOptions: any;

  faTable = faTable;
  faChartArea = faChartArea;

  constructor(private messageCreator: MessageCreator, private translateService: TranslateService, private messageService: MessageService, private earningDevelopmentService: EarningDevelopmentService, private userSettingsService: UserSettingsService, private appLanguageLoaderHelper: AppLanguageLoaderHelper) {

  }

  ngOnInit(): void {
    this.monthlyLoading = true;
    this.localeOfUser = this.appLanguageLoaderHelper.userLanguageCode;
    this.loadUserSettings();
    this.loadMonthyEarningDevelopments();
    this.loadYearlyEarningDevelopments();
  }

  loadUserSettings() {
    this.userSettingsService.getUserSettingBySettingsKey("currency").subscribe((userSetting: UserSetting) => {
      this.selectedCurrency = userSetting.settingValue;
      this.loadUiTranslations(userSetting.settingValue);
    }, err => {
      console.log(err);
    });
  }

  loadUiTranslations(selectedCurrency) {
    this.translateService.get(['earningdevelopment.monthlyChartTitle', 'earningdevelopment.yearlyChartTitle', 'earningdevelopment.monthlyTableTableHeaderDisplayedDate', 'earningdevelopment.monthlyTableTableHeaderCentSum', 'earningdevelopment.yearlyTableTableHeaderDisplayedDate', 'earningdevelopment.yearlyTableTableHeaderCentSum']).subscribe(translations => {
      this.monthlyChartTitle = translations['earningdevelopment.monthlyChartTitle'] + " (" + selectedCurrency + ")";
      this.yearlyChartTitle = translations['earningdevelopment.yearlyChartTitle'] + " (" + selectedCurrency + ")";

      this.monthlyTableColumns = [
        { field: 'dateDisplay', header: translations['earningdevelopment.monthlyTableTableHeaderDisplayedDate'] },
        { field: 'centSum', header: translations['earningdevelopment.monthlyTableTableHeaderCentSum'] }
      ];
      this.monthlyExportColumns = [
        { field: 'dateDisplay', header: translations['earningdevelopment.monthlyTableTableHeaderDisplayedDate'] },
        { field: 'centSum', header: translations['earningdevelopment.monthlyTableTableHeaderCentSum'] }
      ];
      this.monthlyExportedColumns = this.monthlyExportColumns.map(column => ({ title: column.header, dataKey: column.field }));

      this.yearlyTableColumns = [
        { field: 'dateDisplay', header: translations['earningdevelopment.yearlyTableTableHeaderDisplayedDate'] },
        { field: 'centSum', header: translations['earningdevelopment.yearlyTableTableHeaderCentSum'] }
      ];
      this.yearlyExportColumns = [
        { field: 'dateDisplay', header: translations['earningdevelopment.yearlyTableTableHeaderDisplayedDate'] },
        { field: 'centSum', header: translations['earningdevelopment.yearlyTableTableHeaderCentSum'] }
      ];
      this.yearlyExportedColumns = this.yearlyExportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );

  }

  loadGraphStyles() {
    this.monthlyGraphOptions = {
      legend: {
        labels: {
          fontColor: '#ebedef'
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: '#ebedef'
          },
          gridLines: {
            color: 'rgba(255,255,255,0.2)'
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: '#ebedef'
          },
          gridLines: {
            color: 'rgba(255,255,255,0.2)'
          }
        }]
      }
    };

    this.yearlyGraphOptions = {
      legend: {
        labels: {
          fontColor: '#ebedef'
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: '#ebedef'
          },
          gridLines: {
            color: 'rgba(255,255,255,0.2)'
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: '#ebedef'
          },
          gridLines: {
            color: 'rgba(255,255,255,0.2)'
          }
        }]
      }
    };
  }

  loadMonthyEarningDevelopments() {
    this.earningDevelopmentService.getLatestMonthlyEarningDevelopmentList().subscribe((earningDevelopment: EarningDevelopment[]) => {
      this.monthlyEarningDevelopments = earningDevelopment;
      this.monthlyEarningDevelopmentsLength = this.monthlyEarningDevelopments.length;
      this.monthlyLoading = false;
      this.createMonthlyGraph(earningDevelopment);
    }, err => {
      console.log(err);
      this.monthlyLoading = false;
    })
  }

  loadYearlyEarningDevelopments() {
    this.earningDevelopmentService.getLatestYearlyEarningDevelopmentList().subscribe((earningDevelopment: EarningDevelopment[]) => {
      this.yearlyEarningDevelopments = earningDevelopment;
      this.yearlyEarningDevelopmentsLength = this.yearlyEarningDevelopments.length;
      this.yearlyLoading = false;
      this.createYearlyGraph(earningDevelopment);
    }, err => {
      console.log(err);
      this.yearlyLoading = false;
    })
  }

  createMonthlyGraph(monthlyEarningDevelopmentArray: EarningDevelopment[]) {
    let monthlyLabels = [];
    let monthlyData = [];
    monthlyEarningDevelopmentArray.forEach((earningDevelopmentItem: EarningDevelopment) => {
      monthlyLabels.push(earningDevelopmentItem.dateDisplay);
      monthlyData.push(earningDevelopmentItem.centSum / 100);
    });

    this.monthlyEarningDevelopmentGraph = {
      labels: monthlyLabels,
      datasets: [
        {
          label: this.monthlyChartTitle,
          data: monthlyData,
          fill: true,
          borderColor: '#5f00a8',
          backgroundColor: 'rgba(234, 207, 255)'
        }
      ]
    };
  }

  createYearlyGraph(yearlyEarningDevelopmentArray: EarningDevelopment[]) {
    let yearlyLabels = [];
    let yearlyData = [];
    yearlyEarningDevelopmentArray.forEach((earningDevelopmentItem: EarningDevelopment) => {
      yearlyLabels.push(earningDevelopmentItem.dateDisplay);
      yearlyData.push(earningDevelopmentItem.centSum / 100);
    });

    this.yearlyEarningDevelopmentGraph = {
      labels: yearlyLabels,
      datasets: [
        {
          label: this.yearlyChartTitle,
          data: yearlyData,
          fill: true,
          borderColor: '#004db3',
          backgroundColor: 'rgba(171, 207, 255)'
        }
      ]
    };
  }

  monthlyExportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.monthlyExportedColumns, this.monthlyEarningDevelopments);
        doc.save('monthly_earning_developments.pdf');
      })
    })
  }

  monthlyExportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.monthlyEarningDevelopments);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "monthly_earning_developments");
    });
  }

  yearlyExportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.monthlyExportedColumns, this.yearlyEarningDevelopments);
        doc.save('yearly_earning_developments.pdf');
      })
    })
  }

  yearlyExportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.yearlyEarningDevelopments);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "yearly_earning_developments");
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
