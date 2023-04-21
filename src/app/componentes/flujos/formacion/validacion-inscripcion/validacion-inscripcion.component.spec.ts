import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionInscripcionComponent } from './validacion-inscripcion.component';

describe('ValidacionInscripcionComponent', () => {
  let component: ValidacionInscripcionComponent;
  let fixture: ComponentFixture<ValidacionInscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidacionInscripcionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidacionInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
