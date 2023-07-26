import { TestBed } from '@angular/core/testing';

import { FormacionHistoricoService } from './formacion-historico.service';

describe('FormacionHistoricoService', () => {
  let service: FormacionHistoricoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormacionHistoricoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
