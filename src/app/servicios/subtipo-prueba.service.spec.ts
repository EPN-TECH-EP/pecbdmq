import { TestBed } from '@angular/core/testing';

import { SubtipoPruebaService } from './subtipo-prueba.service';

describe('SubtipoPruebaService', () => {
  let service: SubtipoPruebaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtipoPruebaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
