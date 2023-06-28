import { TestBed } from '@angular/core/testing';

import { EstacionTrabajoService } from './estacion-trabajo.service';

describe('EstacionTrabajoService', () => {
  let service: EstacionTrabajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstacionTrabajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
