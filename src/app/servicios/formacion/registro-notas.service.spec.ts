import { TestBed } from '@angular/core/testing';

import { RegistroNotasService } from './registro-notas.service';

describe('RegistroNotasService', () => {
  let service: RegistroNotasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroNotasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
