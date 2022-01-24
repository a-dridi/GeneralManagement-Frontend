import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpenseTableComponent } from './expense-table.component';

describe('ExpenseTableComponent', () => {
  let component: ExpenseTableComponent;
  let fixture: ComponentFixture<ExpenseTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Person 1 should be equal to 300', () => {
    const result = component.calculateExpensesPersonParts(30, 70, 1000);
    expect(result[0]).toBe(300);
  });

  it('Person 2 should be equal to ', () => {
    const result = component.calculateExpensesPersonParts(30, 70, 1000);
    expect(result[1]).toBe(700);
  });
 
});
