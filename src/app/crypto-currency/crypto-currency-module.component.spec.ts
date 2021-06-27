import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoCurrencyModuleComponent } from './crypto-currency-module.component';

describe('CryptoCurrencyModuleComponent', () => {
  let component: CryptoCurrencyModuleComponent;
  let fixture: ComponentFixture<CryptoCurrencyModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoCurrencyModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoCurrencyModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
