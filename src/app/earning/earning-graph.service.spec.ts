import { TestBed } from '@angular/core/testing';

import { EarningGraphService } from './earning-graph.service';

describe('EarningGraphService', () => {
  let service: EarningGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarningGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
