import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitacionExternaSolicitudComponent } from './capacitacion-externa-solicitud.component';

describe('CcapacitacionExternaSolicitudComponent', () => {
  let component: CapacitacionExternaSolicitudComponent;
  let fixture: ComponentFixture<CapacitacionExternaSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacitacionExternaSolicitudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacitacionExternaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
