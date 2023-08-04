import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionesEspecializacionComponent } from './inscripciones-especializacion.component';

describe('PostulantesComponent', () => {
  let component: InscripcionesEspecializacionComponent;
  let fixture: ComponentFixture<InscripcionesEspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscripcionesEspecializacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionesEspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
