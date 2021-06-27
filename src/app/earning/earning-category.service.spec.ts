import { TestBed } from '@angular/core/testing';

import { EarningCategoryService } from './earning-category.service';

describe('EarningCategoryService', () => {
  let service: EarningCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarningCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
