import { TestBed } from '@angular/core/testing';

import { EspecializacionHistoricoService } from './especializacion-historico.service';

describe('EspecializacionHistoricoService', () => {
  let service: EspecializacionHistoricoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspecializacionHistoricoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
