import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpenseGraphComponent } from './expense-graph.component';

describe('ExpenseGraphComponent', () => {
  let component: ExpenseGraphComponent;
  let fixture: ComponentFixture<ExpenseGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
