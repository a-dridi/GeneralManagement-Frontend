import { Component, OnInit } from '@angular/core';
import { faCalendarPlus } from '@fortawesome/free-regular-svg-icons';
import { faChartPie, faClipboardList, faDollarSign, faTable } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {

  faTable = faTable;
  faClipboardList= faClipboardList;
  faDollarSign = faDollarSign;
  faChartPie= faChartPie;
  faCalendarPlus=faCalendarPlus;

  noteTableName = "Expense";
  noteHeight="170px";

  constructor() { }

  ngOnInit(): void {
  }

}
