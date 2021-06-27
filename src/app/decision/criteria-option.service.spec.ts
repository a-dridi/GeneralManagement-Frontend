import { TestBed } from '@angular/core/testing';

import { CriteriaOptionService } from './criteria-option.service';

describe('CriteriaOptionService', () => {
  let service: CriteriaOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriteriaOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
