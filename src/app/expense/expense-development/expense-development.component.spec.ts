import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDevelopmentComponent } from './expense-development.component';

describe('ExpenseDevelopmentComponent', () => {
  let component: ExpenseDevelopmentComponent;
  let fixture: ComponentFixture<ExpenseDevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseDevelopmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
