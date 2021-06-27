import { Component, OnInit } from '@angular/core';
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

  monthlyExpensesData: any;
  monthlyExpensesLabels: string[] = [];
  monthlyExpensesValues: number[] = [];
  yearlyExpensesData: any;
  yearlyExpensesLabels: string[] = [];
  yearlyExpensesValues: number[] = [];
  currentYearExpensesData: any;
  currentYearExpensesLabels: string[] = [];
  currentYearExpensesValues: number[] = [];

  constructor(private messageCreator: MessageCreator, private expenseGraphService: ExpenseGraphService) { }

  ngOnInit(): void {
    this.loadExpensesGraphData();
  }

  loadExpensesGraphData() {
    this.expenseGraphService.getAllMonthlyExpensesSum().subscribe((expensesGraph: ExpenseGraph[]) => {
      expensesGraph.forEach(expensesGraphItem => {
        this.monthlyExpensesLabels.push(expensesGraphItem.categoryTitle);
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
      this.loadYearlyExpensesGraph(hexColorsArray);
      this.loadCurrentYearExpensesGraph();
    }, err => {
      this.messageCreator.showErrorMessage("expenseGraphError1");
      console.log(err);
    });

  }

  loadYearlyExpensesGraph(hexColorsArray) {
    this.expenseGraphService.getAllYearlyExpensesSum().subscribe((expensesGraph: ExpenseGraph[]) => {
      expensesGraph.forEach(expenseGraphItem => {
        this.yearlyExpensesLabels.push(expenseGraphItem.categoryTitle);
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

  loadCurrentYearExpensesGraph() {
    this.expenseGraphService.getAllCurrentYearExpensesSum().subscribe((expensesGraph: ExpenseGraph[]) => {
      expensesGraph.forEach(expenseGraphItem => {
        this.currentYearExpensesLabels.push(expenseGraphItem.categoryTitle);
        this.currentYearExpensesValues.push(expenseGraphItem.centValue);
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
