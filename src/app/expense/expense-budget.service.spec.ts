import { TestBed } from '@angular/core/testing';

import { ExpenseBudgetService } from './expense-budget.service';

describe('ExpenseBudgetService', () => {
  let service: ExpenseBudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseBudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
