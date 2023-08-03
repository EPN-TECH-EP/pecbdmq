import { TestBed } from '@angular/core/testing';

import { EspInscripcionService } from './esp-inscripcion.service';

describe('EspInscripcionService', () => {
  let service: EspInscripcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspInscripcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
