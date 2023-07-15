import { TestBed } from '@angular/core/testing';

import { ResultadosPruebaService } from './resultados-prueba.service';

describe('ResultadosPruebaService', () => {
  let service: ResultadosPruebaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultadosPruebaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
