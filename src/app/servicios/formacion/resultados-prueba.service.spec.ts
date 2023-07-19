import { TestBed } from '@angular/core/testing';

import { ResultadosPruebasService } from './resultados-prueba.service';

describe('ResultadosPruebaService', () => {
  let service: ResultadosPruebasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultadosPruebasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
