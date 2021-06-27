import { TestBed } from '@angular/core/testing';

import { VideoLanguageService } from './video-language.service';

describe('VideoLanguageService', () => {
  let service: VideoLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
