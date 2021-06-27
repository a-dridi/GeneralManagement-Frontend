import { TestBed } from '@angular/core/testing';

import { DecisionOptionService } from './decision-option.service';

describe('DecisionOptionService', () => {
  let service: DecisionOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecisionOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
