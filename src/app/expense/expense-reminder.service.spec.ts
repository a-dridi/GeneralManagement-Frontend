import { TestBed } from '@angular/core/testing';

import { ExpenseReminderService } from './expense-reminder.service';

describe('ExpenseReminderService', () => {
  let service: ExpenseReminderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseReminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
