import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignacionInscripcionComponent } from './reasignacion-inscripcion.component';

describe('ReasignacionInscripcionComponent', () => {
  let component: ReasignacionInscripcionComponent;
  let fixture: ComponentFixture<ReasignacionInscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasignacionInscripcionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReasignacionInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
