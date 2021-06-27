import { Component, OnInit } from '@angular/core';
import { faChartLine, faChartPie, faClipboardList, faTable } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-earning',
  templateUrl: './earning.component.html',
  styleUrls: ['./earning.component.scss']
})
export class EarningComponent implements OnInit {

  faTable = faTable;
  faClipboardList= faClipboardList;
  faChartLine= faChartLine;
  
  noteTableName = "Earning";
  noteHeight="170px";

  constructor() { }

  ngOnInit(): void {
  }
}
