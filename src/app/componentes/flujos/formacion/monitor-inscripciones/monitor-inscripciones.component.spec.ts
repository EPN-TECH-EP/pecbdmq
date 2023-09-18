import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorInscripcionesComponent } from './monitor-inscripciones.component';

describe('MonitorInscripcionesComponent', () => {
  let component: MonitorInscripcionesComponent;
  let fixture: ComponentFixture<MonitorInscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorInscripcionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorInscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
