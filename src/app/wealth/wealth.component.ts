import { Component, OnInit } from '@angular/core';
import { faBorderAll, faTable } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-wealth',
  templateUrl: './wealth.component.html',
  styleUrls: ['./wealth.component.scss']
})
export class WealthComponent implements OnInit {

  faTable = faTable;
  faBorderAlt = faBorderAll;

  noteTableName = "Wealth";
  noteHeight = "150px";

  constructor() { }

  ngOnInit(): void {
  }

}
