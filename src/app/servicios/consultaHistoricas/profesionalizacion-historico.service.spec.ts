import { TestBed } from '@angular/core/testing';

import { ProfesionalizacionHistoricoService } from './profesionalizacion-historico.service';

describe('ProfesionalizacionHistoricoService', () => {
  let service: ProfesionalizacionHistoricoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfesionalizacionHistoricoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
