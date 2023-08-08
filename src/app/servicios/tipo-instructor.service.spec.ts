import { TestBed } from '@angular/core/testing';

import { TipoInstructorService } from './tipo-instructor.service';

describe('TipoInstructorService', () => {
  let service: TipoInstructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoInstructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
