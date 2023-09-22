import { TestBed } from '@angular/core/testing';

import { LlamamientoDosService } from './llamamiento-dos.service';

describe('LlamamientoDosService', () => {
  let service: LlamamientoDosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlamamientoDosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
