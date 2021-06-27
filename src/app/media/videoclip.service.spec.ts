import { TestBed } from '@angular/core/testing';

import { VideoclipService } from './videoclip.service';

describe('VideoclipService', () => {
  let service: VideoclipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoclipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
