import { Component, OnInit } from '@angular/core';
import { faTable, faClipboardList, faChartLine } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  faTable = faTable;
  faClipboardList = faClipboardList;
  faChartLine = faChartLine;

  noteTableName = "Book";
  noteHeight = "170px";

  constructor() { }

  ngOnInit(): void {
  }

}
