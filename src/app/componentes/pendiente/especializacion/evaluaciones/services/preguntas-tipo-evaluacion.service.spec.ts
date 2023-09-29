import { TestBed } from '@angular/core/testing';

import { PreguntasTipoEvaluacionService } from './preguntas-tipo-evaluacion.service';

describe('PreguntasTipoEvaluacionService', () => {
  let service: PreguntasTipoEvaluacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreguntasTipoEvaluacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
