import { TestBed } from '@angular/core/testing';

import { DocumentosCursoService } from './documentos-curso.service';

describe('DocumentosCursoService', () => {
  let service: DocumentosCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentosCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
