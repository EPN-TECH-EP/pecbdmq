import { TestBed } from '@angular/core/testing';

import { DocumentoPruebaService } from './documento-prueba.service';

describe('DocumentoPruebaService', () => {
  let service: DocumentoPruebaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoPruebaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
