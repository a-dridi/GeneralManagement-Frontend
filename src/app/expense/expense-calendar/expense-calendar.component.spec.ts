import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCalendarComponent } from './expense-calendar.component';

describe('ExpenseCalendarComponent', () => {
  let component: ExpenseCalendarComponent;
  let fixture: ComponentFixture<ExpenseCalendarComponent>;

  beforeEach(async(() => {
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
