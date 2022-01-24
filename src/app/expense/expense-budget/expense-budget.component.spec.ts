import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpenseBudgetComponent } from './expense-budget.component';

describe('ExpenseBudgetComponent', () => {
  let component: ExpenseBudgetComponent;
  let fixture: ComponentFixture<ExpenseBudgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
