import { TestBed } from '@angular/core/testing';

import { EspDelegadoService } from './esp-delegado.service';

describe('DelegadoService', () => {
  let service: EspDelegadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspDelegadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
