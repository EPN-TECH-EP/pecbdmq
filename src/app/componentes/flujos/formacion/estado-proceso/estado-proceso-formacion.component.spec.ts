import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoProcesoFormacionComponent } from './estado-proceso-formacion.component';

describe('EstadoProcesoComponent', () => {
  let component: EstadoProcesoFormacionComponent;
  let fixture: ComponentFixture<EstadoProcesoFormacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoProcesoFormacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoProcesoFormacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
