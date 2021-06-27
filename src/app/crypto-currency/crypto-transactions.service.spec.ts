import { TestBed } from '@angular/core/testing';

import { CryptoTransactionsService } from './crypto-transactions.service';

describe('CryptoTransactionsService', () => {
  let service: CryptoTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
