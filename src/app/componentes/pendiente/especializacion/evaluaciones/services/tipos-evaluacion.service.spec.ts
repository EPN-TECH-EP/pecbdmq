import { TestBed } from '@angular/core/testing';

import { TiposEvaluacionService } from './tipos-evaluacion.service';

describe('TiposEvaluacionService', () => {
  let service: TiposEvaluacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposEvaluacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
