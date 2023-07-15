import { TestBed } from '@angular/core/testing';

import { ParametrizaPruebaService } from './parametriza-prueba-resumen.service';

describe('ParametrizaPruebaResumenService', () => {
  let service: ParametrizaPruebaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrizaPruebaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
