import { TestBed } from '@angular/core/testing';

import { EstadoPeriodoAcademicoService } from './estado-periodo-academico.service';

describe('EstadoPeriodoAcademicoService', () => {
  let service: EstadoPeriodoAcademicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoPeriodoAcademicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
