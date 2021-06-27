import { Component, OnInit } from '@angular/core';
import { faChartArea, faTable } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ExpenseDevelopment } from 'src/app/expense/model/expense-development';
import { MessageCreator } from 'src/app/util/messageCreator';
import { ExpenseDevelopmentService } from '../expense-development.service';

@Component({
  selector: 'app-expense-development',
  templateUrl: './expense-development.component.html',
  styleUrls: ['./expense-development.component.scss']
})
export class ExpenseDevelopmentComponent implements OnInit {

  monthlyLoading: boolean;
  monthlyTableColumns: any[];
  monthlyExportColumns: any[];
  monthlyExportedColumns: any[];

  yearlyLoading: boolean;
  yearlyTableColumns: any[];
  yearlyExportColumns: any[];
  yearlyExportedColumns: any[];

  monthlyChartTitle: string;
  monthlyExpenseDevelopments: ExpenseDevelopment[];
  monthlyExpenseDevelopmentGraph: any;
  monthlyGraphOptions: any;

  yearlyChartTitle: string;
  yearlyExpenseDevelopments: ExpenseDevelopment[];
  yearlyExpenseDevelopmentGraph: any;
  yearlyGraphOptions: any;

  faTable = faTable;
  faChartArea = faChartArea;

  constructor(private messageCreator: MessageCreator, private translateService: TranslateService, private messageService: MessageService, private expenseDevelopmentService: ExpenseDevelopmentService) {

  }

  ngOnInit(): void {
    this.monthlyLoading = true;
    this.translateService.get(['expensedevelopment.monthlyChartTitle', 'expensedevelopment.yearlyChartTitle', 'expensedevelopment.monthlyTableTableHeaderDisplayedDate', 'expensedevelopment.monthlyTableTableHeaderCentSum', 'expensedevelopment.yearlyTableTableHeaderDisplayedDate', 'expensedevelopment.yearlyTableTableHeaderCentSum']).subscribe(translations => {
      this.monthlyChartTitle = translations['expensedevelopment.monthlyChartTitle']
      this.yearlyChartTitle = translations['expensedevelopment.yearlyChartTitle']

      this.monthlyTableColumns = [
        { field: 'dateDisplay', header: translations['expensedevelopment.monthlyTableTableHeaderDisplayedDate'] },
        { field: 'centSum', header: translations['expensedevelopment.monthlyTableTableHeaderCentSum'] }
      ];
      this.monthlyExportColumns = [
        { field: 'dateDisplay', header: translations['expensedevelopment.monthlyTableTableHeaderDisplayedDate'] },
        { field: 'centSum', header: translations['expensedevelopment.monthlyTableTableHeaderCentSum'] }
      ];
      this.monthlyExportedColumns = this.monthlyExportColumns.map(column => ({ title: column.header, dataKey: column.field }));

      this.yearlyTableColumns = [
        { field: 'dateDisplay', header: translations['expensedevelopment.yearlyTableTableHeaderDisplayedDate'] },
        { field: 'centSum', header: translations['expensedevelopment.yearlyTableTableHeaderCentSum'] }
      ];
      this.yearlyExportColumns = [
        { field: 'dateDisplay', header: translations['expensedevelopment.yearlyTableTableHeaderDisplayedDate'] },
        { field: 'centSum', header: translations['expensedevelopment.yearlyTableTableHeaderCentSum'] }
      ];
      this.yearlyExportedColumns = this.yearlyExportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    }
    );

    this.loadMonthyExpenseDevelopments();
    this.loadYearlyExpenseDevelopments();
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

  loadMonthyExpenseDevelopments() {
    this.expenseDevelopmentService.getLatestMonthlyExpenseDevelopmentList().subscribe((expenseDevelopment: ExpenseDevelopment[]) => {
      console.log("loadMonthyExpenseDevelopments")
      console.log(expenseDevelopment)
      this.monthlyExpenseDevelopments = expenseDevelopment;
      this.monthlyLoading = false;
      this.createMonthlyGraph(expenseDevelopment);
    }, err => {
      console.log(err);
      this.monthlyLoading = false;
    })
  }

  loadYearlyExpenseDevelopments() {
    this.expenseDevelopmentService.getLatestYearlyExpenseDevelopmentList().subscribe((expenseDevelopment: ExpenseDevelopment[]) => {
      this.yearlyExpenseDevelopments = expenseDevelopment;
      this.yearlyLoading = false;
      this.createYearlyGraph(expenseDevelopment);
    }, err => {
      console.log(err);
      this.yearlyLoading = false;
    })
  }

  createMonthlyGraph(monthlyExpenseDevelopmentArray: ExpenseDevelopment[]) {
    let monthlyLabels = [];
    let monthlyData = [];
    monthlyExpenseDevelopmentArray.forEach((expenseDevelopmentItem: ExpenseDevelopment) => {
      monthlyLabels.push(expenseDevelopmentItem.dateDisplay);
      monthlyData.push(expenseDevelopmentItem.centSum / 100);
    });

    this.monthlyExpenseDevelopmentGraph = {
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

  createYearlyGraph(yearlyExpenseDevelopmentArray: ExpenseDevelopment[]) {
    let yearlyLabels = [];
    let yearlyData = [];
    yearlyExpenseDevelopmentArray.forEach((expenseDevelopmentItem: ExpenseDevelopment) => {
      yearlyLabels.push(expenseDevelopmentItem.dateDisplay);
      yearlyData.push(expenseDevelopmentItem.centSum / 100);
    });

    this.yearlyExpenseDevelopmentGraph = {
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
        doc.autoTable(this.monthlyExportedColumns, this.monthlyExpenseDevelopments);
        doc.save('monthly_expense_developments.pdf');
      })
    })
  }

  monthlyExportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.monthlyExpenseDevelopments);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "monthly_expense_developments");
    });
  }

  yearlyExportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.monthlyExportedColumns, this.yearlyExpenseDevelopments);
        doc.save('yearly_expense_developments.pdf');
      })
    })
  }

  yearlyExportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.yearlyExpenseDevelopments);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "yearly_expense_developments");
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
