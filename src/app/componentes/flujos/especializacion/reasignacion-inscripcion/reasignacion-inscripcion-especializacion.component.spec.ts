import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignacionInscripcionEspComponent } from './reasignacion-inscripcion-especializacion.component';

describe('ReasignacionInscripcionComponent', () => {
  let component: ReasignacionInscripcionEspComponent;
  let fixture: ComponentFixture<ReasignacionInscripcionEspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasignacionInscripcionEspComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReasignacionInscripcionEspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
