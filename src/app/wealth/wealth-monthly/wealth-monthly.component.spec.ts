import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthMonthlyComponent } from './wealth-monthly.component';

describe('WealthMonthlyComponent', () => {
  let component: WealthMonthlyComponent;
  let fixture: ComponentFixture<WealthMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WealthMonthlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WealthMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
