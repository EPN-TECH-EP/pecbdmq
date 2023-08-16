import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProListadoInscripcionDelegadoComponent } from './pro-listado-inscripcion-delegado.component';

describe('ProListadoInscripcionDelegadoComponent', () => {
  let component: ProListadoInscripcionDelegadoComponent;
  let fixture: ComponentFixture<ProListadoInscripcionDelegadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProListadoInscripcionDelegadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProListadoInscripcionDelegadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
