import { TestBed } from '@angular/core/testing';

import { EarningDevelopmentService } from './earning-development.service';

describe('EarningDevelopmentService', () => {
  let service: EarningDevelopmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarningDevelopmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
