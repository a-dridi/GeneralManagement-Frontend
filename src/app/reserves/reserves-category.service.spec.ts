import { TestBed } from '@angular/core/testing';

import { ReservesCategoryService } from './reserves-category.service';

describe('ReservesCategoryService', () => {
  let service: ReservesCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservesCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
