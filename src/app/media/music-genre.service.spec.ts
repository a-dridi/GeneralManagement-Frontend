import { TestBed } from '@angular/core/testing';

import { MusicGenreService } from './music-genre.service';

describe('MusicGenreService', () => {
  let service: MusicGenreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicGenreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
