import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorInscripcionesCursoComponent } from './monitor-inscripciones-curso.component';

describe('MonitorInscripcionesCursoComponent', () => {
  let component: MonitorInscripcionesCursoComponent;
  let fixture: ComponentFixture<MonitorInscripcionesCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorInscripcionesCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorInscripcionesCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
