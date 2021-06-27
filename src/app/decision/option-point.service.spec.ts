import { TestBed } from '@angular/core/testing';

import { OptionPointService } from './option-point.service';

describe('OptionPointService', () => {
  let service: OptionPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
