import { TestBed } from '@angular/core/testing';

import { SoftwareOsService } from './software-os.service';

describe('SoftwareOsService', () => {
  let service: SoftwareOsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoftwareOsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
