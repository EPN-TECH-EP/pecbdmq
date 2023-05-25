import { TestBed } from '@angular/core/testing';

import { ValidacionInscripcionService } from './validacion-inscripcion.service';

describe('ValidacionInscripcionService', () => {
  let service: ValidacionInscripcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidacionInscripcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
