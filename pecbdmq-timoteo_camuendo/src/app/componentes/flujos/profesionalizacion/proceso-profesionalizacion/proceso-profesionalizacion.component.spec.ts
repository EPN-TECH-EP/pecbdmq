import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoProfesionalizacionComponent } from './proceso-profesionalizacion.component';

describe('ProcesoProfesionalizacionComponent', () => {
  let component: ProcesoProfesionalizacionComponent;
  let fixture: ComponentFixture<ProcesoProfesionalizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesoProfesionalizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesoProfesionalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
