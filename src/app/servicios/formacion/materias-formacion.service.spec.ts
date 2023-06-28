import { TestBed } from '@angular/core/testing';

import { MateriasFormacionService } from './materias-formacion.service';

describe('MateriasFormacionService', () => {
  let service: MateriasFormacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MateriasFormacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
