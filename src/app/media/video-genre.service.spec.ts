import { TestBed } from '@angular/core/testing';

import { VideoGenreService } from './video-genre.service';

describe('VideoGenreService', () => {
  let service: VideoGenreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoGenreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
