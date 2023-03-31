import { TestBed } from '@angular/core/testing';

import { PonderacionService } from './ponderacion.service';

describe('PonderacionService', () => {
  let service: PonderacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PonderacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
