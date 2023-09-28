import { TestBed } from '@angular/core/testing';

import { RespuestasEstudiantesService } from './respuestas-estudiantes.service';

describe('RespuestasEstudiantesService', () => {
  let service: RespuestasEstudiantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RespuestasEstudiantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
