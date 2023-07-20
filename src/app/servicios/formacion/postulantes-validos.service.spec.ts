import { TestBed } from '@angular/core/testing';

import { PostulantesValidosService } from './postulantes-validos.service';

describe('PostulantesValidosService', () => {
  let service: PostulantesValidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostulantesValidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
