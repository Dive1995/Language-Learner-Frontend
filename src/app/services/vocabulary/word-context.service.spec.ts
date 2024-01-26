import { TestBed } from '@angular/core/testing';

import { WordContextService } from './word-context.service';

describe('WordContextService', () => {
  let service: WordContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
