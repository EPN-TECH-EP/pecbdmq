import { TestBed } from '@angular/core/testing';

import { CapacitacionExternaService } from './capacitacion-externa.service';

describe('CapacitacionExternaService', () => {
  let service: CapacitacionExternaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapacitacionExternaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
