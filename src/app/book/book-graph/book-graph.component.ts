import { Component, OnInit } from '@angular/core';
import { faChartPie, faTable } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageCreator } from 'src/app/util/messageCreator';
import { ValuesGenerator } from 'src/app/util/valuesGenerator';
import { BookGraphService } from '../book-graph.service';
import { BookGraph } from '../model/book-graph.model';

@Component({
  selector: 'app-book-graph',
  templateUrl: './book-graph.component.html',
  styleUrls: ['./book-graph.component.scss']
})
export class BookGraphComponent implements OnInit {

  categoryAmountList: BookGraph[];
  categoryAmountData: any;
  categoryAmountLabels: string[];
  categoryAmountValues: number[];

  languageAmountList: BookGraph[];
  languageAmountData: any;
  languageAmountLabels: string[];
  languageAmountValues: number[];

  faTable = faTable;
  faChartPie = faChartPie;

  constructor(private messageCreator: MessageCreator, private bookGraphService: BookGraphService) { }

  ngOnInit(): void {
    this.loadBookCategoryAmountGraph();
    this.loadBookLanguageAmountGraph();
  }

  loadBookCategoryAmountGraph() {
    this.bookGraphService.getBookCategoryAmountList().subscribe((bookGraph: BookGraph[]) => {
      this.categoryAmountList = bookGraph;
      this.categoryAmountLabels=[];
      this.categoryAmountValues=[];
      bookGraph.forEach(bookGraphItem => {
        this.categoryAmountLabels.push(bookGraphItem.title);
        this.categoryAmountValues.push(bookGraphItem.amount);
      });
      let hexColorsArray = ValuesGenerator.getHexColorValuesArray(this.categoryAmountList.length);

      this.categoryAmountData = {
        labels: this.categoryAmountLabels,
        datasets: [
          {
            data: this.categoryAmountValues,
            backgroundColor: hexColorsArray,
            hoverBackgroundColor: hexColorsArray
          }
        ]
      };
    }, err => {
      console.log(err);
    });
  }

  loadBookLanguageAmountGraph() {
    this.bookGraphService.getBookLanguageAmountList().subscribe((bookGraph: BookGraph[]) => {
      this.languageAmountList = bookGraph;
      this.languageAmountLabels=[];
      this.languageAmountValues=[];
      bookGraph.forEach(bookGraphItem => {
        this.languageAmountLabels.push(bookGraphItem.title);
        this.languageAmountValues.push(bookGraphItem.amount);
      });
      let hexColorsArray = ValuesGenerator.getHexColorValuesArray(this.languageAmountList.length);

      this.languageAmountData = {
        labels: this.languageAmountLabels,
        datasets: [
          {
            data: this.languageAmountValues,
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
