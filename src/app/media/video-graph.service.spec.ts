import { TestBed } from '@angular/core/testing';

import { VideoGraphService } from './video-graph.service';

describe('VideoGraphService', () => {
  let service: VideoGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
