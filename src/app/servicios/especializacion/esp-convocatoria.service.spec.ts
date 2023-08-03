import { TestBed } from '@angular/core/testing';

import { EspConvocatoriaService } from './esp-convocatoria.service';

describe('EspConvocatoriaService', () => {
  let service: EspConvocatoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspConvocatoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
