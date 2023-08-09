import { TestBed } from '@angular/core/testing';

import { EspRegistroNotasService } from './esp-registro-notas.service';

describe('EspRegistroNotasService', () => {
  let service: EspRegistroNotasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspRegistroNotasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
