import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionEspecializacionComponent } from './inscripcion-especializacion.component';

describe('InscripcionComponent', () => {
  let component: InscripcionEspecializacionComponent;
  let fixture: ComponentFixture<InscripcionEspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscripcionEspecializacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionEspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
