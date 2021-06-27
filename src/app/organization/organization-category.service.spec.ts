import { TestBed } from '@angular/core/testing';

import { OrganizationCategoryService } from './organization-category.service';

describe('OrganizationCategoryService', () => {
  let service: OrganizationCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
