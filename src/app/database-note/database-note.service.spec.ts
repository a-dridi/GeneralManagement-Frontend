import { TestBed } from '@angular/core/testing';

import { DatabaseNoteService } from './database-note.service';

describe('DatabaseNoteService', () => {
  let service: DatabaseNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
