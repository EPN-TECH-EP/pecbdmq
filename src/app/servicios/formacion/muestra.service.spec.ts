import { TestBed } from '@angular/core/testing';

import { MuestraService } from './muestra.service';

describe('MuestraService', () => {
  let service: MuestraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuestraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
