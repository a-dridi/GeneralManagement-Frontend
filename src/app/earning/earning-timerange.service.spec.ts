import { TestBed } from '@angular/core/testing';

import { EarningTimerangeService } from './earning-timerange.service';

describe('EarningTimerangeService', () => {
  let service: EarningTimerangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarningTimerangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
