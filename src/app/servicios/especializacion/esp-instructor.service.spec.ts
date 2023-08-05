import { TestBed } from '@angular/core/testing';

import { EspInstructorService } from './esp-instructor.service';

describe('InstructorService', () => {
  let service: EspInstructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspInstructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
