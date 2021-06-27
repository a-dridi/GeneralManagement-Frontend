import { TestBed } from '@angular/core/testing';

import { WealthMonthlyService } from './wealth-monthly.service';

describe('WealthMonthlyService', () => {
  let service: WealthMonthlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WealthMonthlyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
