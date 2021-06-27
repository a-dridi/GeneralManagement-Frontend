import { Component, OnInit } from '@angular/core';
import { faChartPie, faTable } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { EarningCategory } from 'src/app/earning/model/earning-category.model';
import { EarningGraph } from 'src/app/earning/model/earning-graph.model';
import { MessageCreator } from 'src/app/util/messageCreator';
import { ValuesGenerator } from 'src/app/util/valuesGenerator';
import { EarningCategoryService } from '../earning-category.service';
import { EarningGraphService } from '../earning-graph.service';

@Component({
  selector: 'app-earning-categories',
  templateUrl: './earning-categories.component.html',
  styleUrls: ['./earning-categories.component.scss']
})
export class EarningCategoriesComponent implements OnInit {

  earningCategoriesMonthly: EarningGraph[];
  earningCategoriesYearly: EarningGraph[];
  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];
  earningCategories: EarningCategory[];

  monthlyEarningsData: any;
  monthlyEarningsLabels: string[] = [];
  monthlyEarningsValues: number[] = [];
  yearlyEarningsData: any;
  yearlyEarningsLabels: string[] = [];
  yearlyEarningsValues: number[] = [];
  currentYearEarningsData: any;
  currentYearEarningsLabels: string[] = [];
  currentYearEarningsValues: number[] = [];

  faTable = faTable;
  faChartPie = faChartPie;
  loading: boolean;

  constructor(private messageCreator: MessageCreator, private earningGraphService: EarningGraphService, private earningCategoryService: EarningCategoryService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.loading = true;
    this.translateService.get(['earningCategory.earningCategoryTableHeaderCategory', 'earningCategory.earningCategoryTableHeaderSum']).subscribe(translations => {
      this.tableColumns = [
        { field: 'earningCategory', header: translations['earningCategory.earningCategoryTableHeaderCategory'] },
        { field: 'centValue', header: translations['earningCategory.earningCategoryTableHeaderSum'] }
      ];
      this.exportColumns = [
        { field: 'earningCategory', header: translations['earningCategory.earningCategoryTableHeaderCategory'] },
        { field: 'centValue', header: translations['earningCategory.earningCategoryTableHeaderSum'] }
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
    });
    this.loadEarningCategories();
  }

  /**
   * Load all earning categories tables and graphics
   */
  loadEarningCategories() {
    this.earningCategoryService.getAllEarningCategory().subscribe((data: EarningCategory[]) => {
      this.earningCategories = data;
      let hexColorsArray = ValuesGenerator.getHexColorValuesArray(this.earningCategories.length);
      this.loadEarningSumCategories(hexColorsArray);
    }, err => {
      console.log(err);
    });
  }

  loadEarningSumCategories(hexColorsArray: string[]) {
    this.earningGraphService.getAllMonthlyEarningsSum().subscribe((earningCategories: EarningGraph[]) => {
      this.earningCategoriesMonthly = earningCategories;
      this.loadMonthlyEarningsGraphData(hexColorsArray);
    }, err => {
      this.messageCreator.showErrorMessage('earningCategoryError1');
      console.log(err);
    });

    this.earningGraphService.getAllYearlyEarningsSum().subscribe((earningCategories: EarningGraph[]) => {
      this.earningCategoriesYearly = earningCategories;
      this.loadYearlyEarningsGraph(hexColorsArray);
      this.loadCurrentYearEarningsGraph();
      this.loading = false;
    }, err => {
      this.messageCreator.showErrorMessage('earningCategoryError1');
      console.log(err);
      this.loading = false;
    });
  }

  loadMonthlyEarningsGraphData(hexColorsArray: string[]) {
    this.earningCategoriesMonthly.forEach(earningsGraphItem => {
      this.monthlyEarningsLabels.push(earningsGraphItem.categoryTitle);
      this.monthlyEarningsValues.push(earningsGraphItem.centValue / 100);
    });
    this.monthlyEarningsData = {
      labels: this.monthlyEarningsLabels,
      datasets: [
        {
          data: this.monthlyEarningsValues,
          backgroundColor: hexColorsArray,
          hoverBackgroundColor: hexColorsArray
        }
      ]
    };
  }

  loadYearlyEarningsGraph(hexColorsArray: string[]) {
    this.earningCategoriesYearly.forEach(earningsGraphItem => {
      this.yearlyEarningsLabels.push(earningsGraphItem.categoryTitle);
      this.yearlyEarningsValues.push(earningsGraphItem.centValue / 100);
    });

    this.yearlyEarningsData = {
      labels: this.yearlyEarningsLabels,
      datasets: [
        {
          data: this.yearlyEarningsValues,
          backgroundColor: hexColorsArray,
          hoverBackgroundColor: hexColorsArray
        }
      ]
    };
  }

  loadCurrentYearEarningsGraph() {
    this.earningGraphService.getAllCurrentYearEarningsSum().subscribe((earningsGraph: EarningGraph[]) => {
      earningsGraph.forEach(earningGraphItem => {
        this.currentYearEarningsLabels.push(earningGraphItem.categoryTitle);
        this.currentYearEarningsValues.push(earningGraphItem.centValue);
      });
      let hexColorsArray = ValuesGenerator.getHexColorValuesArray(earningsGraph.length);

      this.currentYearEarningsData = {
        labels: this.currentYearEarningsLabels,
        datasets: [
          {
            data: this.currentYearEarningsValues,
            backgroundColor: hexColorsArray,
            hoverBackgroundColor: hexColorsArray
          }
        ]
      };
    }, err => {
      console.log(err);
    });
  }

  exportPdfMonthly() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.earningCategoriesMonthly);
        doc.save('monthly_earnings.pdf');
      })
    })
  }

  exportExcelMonthly() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.earningCategoriesMonthly);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "monthly_earnings");
    });
  }

  exportPdfYearly() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportedColumns, this.earningCategoriesYearly);
        doc.save('yearly_earnings.pdf');
      })
    })
  }

  exportExcelYearly() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.earningCategoriesYearly);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "yearly_earnings");
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
