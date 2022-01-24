import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from 'src/app/user-settings.service';
import { UserSetting } from 'src/app/user/model/user-setting.model';
import { GraphDesignSettings } from 'src/app/util/graphDesignSettings';
import { MessageCreator } from 'src/app/util/messageCreator';
import { ValuesGenerator } from 'src/app/util/valuesGenerator';
import { ExpenseGraphService } from '../expensegraph.services';
import { ExpenseGraph } from '../model/expense-graph.model';

@Component({
  selector: 'app-expense-graph',
  templateUrl: './expense-graph.component.html',
  styleUrls: ['./expense-graph.component.scss']
})
export class ExpenseGraphComponent implements OnInit {
  //Settings
  selectedCurrency: string = "USD";

  monthlyExpensesData: any = new Date();
  monthlyExpensesLabels: string[] = [];
  monthlyExpensesValues: number[] = [];
  yearlyExpensesData: any = new Date();
  yearlyExpensesLabels: string[] = [];
  yearlyExpensesValues: number[] = [];
  currentYearExpensesData: any;
  currentYearExpensesLabels: string[] = [];
  currentYearExpensesValues: number[] = [];

  chartOptions: any;

  constructor(private messageCreator: MessageCreator, private expenseGraphService: ExpenseGraphService, private graphDesign: GraphDesignSettings, private userSettingsService: UserSettingsService) { }

  ngOnInit(): void {

    this.userSettingsService.getUserSettingBySettingsKey("currency").subscribe((userSetting: UserSetting) => {
      this.selectedCurrency = userSetting.settingValue;
      this.loadExpensesGraphData(this.selectedCurrency);
    }, err => {
      console.log(err);
    });

    this.chartOptions = this.graphDesign.getDesignSettings();
  }

  loadExpensesGraphData(selectedCurrency) {
    this.expenseGraphService.getAllMonthlyExpensesSum().subscribe((expensesGraph: ExpenseGraph[]) => {
      expensesGraph.forEach(expensesGraphItem => {
        this.monthlyExpensesLabels.push(expensesGraphItem.categoryTitle + " (" + selectedCurrency + ")");
        this.monthlyExpensesValues.push(expensesGraphItem.centValue / 100);
      });
      let hexColorsArray = ValuesGenerator.getHexColorValuesArray(expensesGraph.length);
      this.monthlyExpensesData = {
        labels: this.monthlyExpensesLabels,
        datasets: [
          {
            data: this.monthlyExpensesValues,
            backgroundColor: hexColorsArray,
            hoverBackgroundColor: hexColorsArray
          }
        ]
      };
      this.loadYearlyExpensesGraph(hexColorsArray, selectedCurrency);
      this.loadCurrentYearExpensesGraph(selectedCurrency);
    }, err => {
      this.messageCreator.showErrorMessage("expenseGraphError1");
      console.log(err);
    });

  }

  loadYearlyExpensesGraph(hexColorsArray, selectedCurrency) {
    this.expenseGraphService.getAllYearlyExpensesSum().subscribe((expensesGraph: ExpenseGraph[]) => {
      expensesGraph.forEach(expenseGraphItem => {
        this.yearlyExpensesLabels.push(expenseGraphItem.categoryTitle + " (" + selectedCurrency + ")");
        this.yearlyExpensesValues.push(expenseGraphItem.centValue / 100);
      });

      this.yearlyExpensesData = {
        labels: this.yearlyExpensesLabels,
        datasets: [
          {
            data: this.yearlyExpensesValues,
            backgroundColor: hexColorsArray,
            hoverBackgroundColor: hexColorsArray
          }
        ]
      };
    }, err => {
      console.log(err);
    });
  }

  loadCurrentYearExpensesGraph(selectedCurrency) {
    this.expenseGraphService.getAllCurrentYearExpensesSum().subscribe((expensesGraph: ExpenseGraph[]) => {
      expensesGraph.forEach(expenseGraphItem => {
        this.currentYearExpensesLabels.push(expenseGraphItem.categoryTitle + " (" + selectedCurrency + ")");
        this.currentYearExpensesValues.push(expenseGraphItem.centValue / 100);
      });
      let hexColorsArray = ValuesGenerator.getHexColorValuesArray(expensesGraph.length);

      this.currentYearExpensesData = {
        labels: this.currentYearExpensesLabels,
        datasets: [
          {
            data: this.currentYearExpensesValues,
            backgroundColor: hexColorsArray,
            hoverBackgroundColor: hexColorsArray
          }
        ]
      };
    }, err => {
      console.log(err);
    });
  }

}
