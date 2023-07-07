import { TestBed } from '@angular/core/testing';

import { PruebaDetalleService } from './prueba-detalle.service';

describe('PruebaDetalleService', () => {
  let service: PruebaDetalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PruebaDetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
