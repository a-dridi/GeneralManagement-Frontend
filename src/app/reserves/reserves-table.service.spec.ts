import { TestBed } from '@angular/core/testing';

import { ReservesTableService } from './reserves-table.service';

describe('ReservesTableService', () => {
  let service: ReservesTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservesTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
