import { TestBed } from '@angular/core/testing';

import { ExpenseTableChangedService } from './expense-table-changed.service';

describe('ExpenseTableChangedService', () => {
  let service: ExpenseTableChangedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseTableChangedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
