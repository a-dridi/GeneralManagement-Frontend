import { TestBed } from '@angular/core/testing';

import { VideoclipLanguageService } from './videoclip-language.service';

describe('VideoclipLanguageService', () => {
  let service: VideoclipLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoclipLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
