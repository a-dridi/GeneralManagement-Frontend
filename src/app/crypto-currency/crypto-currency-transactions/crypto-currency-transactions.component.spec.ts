import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoCurrencyTransactionsComponent } from './crypto-currency-transactions.component';

describe('CryptoCurrencyTransactionsComponent', () => {
  let component: CryptoCurrencyTransactionsComponent;
  let fixture: ComponentFixture<CryptoCurrencyTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoCurrencyTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoCurrencyTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
