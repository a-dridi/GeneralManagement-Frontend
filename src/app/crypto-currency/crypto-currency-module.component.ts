import { Component, OnInit } from '@angular/core';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-crypto-currency-module',
  templateUrl: './crypto-currency-module.component.html',
  styleUrls: ['./crypto-currency-module.component.scss']
})
export class CryptoCurrencyModuleComponent implements OnInit {

  faBitcoin = faBitcoin;
  faExchangeAlt = faExchangeAlt;
  
  noteTableName = "CryptoCurrency";
  noteHeight="150px";

  constructor() { }

  ngOnInit(): void {
  }

}
