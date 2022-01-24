import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpenseCalendarComponent } from './expense-calendar.component';

describe('ExpenseCalendarComponent', () => {
  let component: ExpenseCalendarComponent;
  let fixture: ComponentFixture<ExpenseCalendarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
