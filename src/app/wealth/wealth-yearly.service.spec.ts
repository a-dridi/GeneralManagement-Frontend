import { TestBed } from '@angular/core/testing';

import { WealthYearlyService } from './wealth-yearly.service';

describe('WealthYearlyService', () => {
  let service: WealthYearlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WealthYearlyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
