import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosInscripcionesComponent } from './resultados-inscripciones.component';

describe('ResultadosInscripcionesComponent', () => {
  let component: ResultadosInscripcionesComponent;
  let fixture: ComponentFixture<ResultadosInscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadosInscripcionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosInscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
