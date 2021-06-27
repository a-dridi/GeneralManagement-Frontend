import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthYearlyComponent } from './wealth-yearly.component';

describe('WealthYearlyComponent', () => {
  let component: WealthYearlyComponent;
  let fixture: ComponentFixture<WealthYearlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WealthYearlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WealthYearlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
