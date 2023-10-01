import { TestBed } from '@angular/core/testing';

import { ReporteriaService } from './reporteria.service';

describe('ReporteriaService', () => {
  let service: ReporteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
