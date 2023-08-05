import { TestBed } from '@angular/core/testing';

import { TipoCursoService } from './tipo-curso.service';

describe('TipoCursoService', () => {
  let service: TipoCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
