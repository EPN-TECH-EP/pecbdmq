import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoProcesoCursoComponent } from './estado-proceso-curso.component';

describe('EstadoProcesoCursoComponent', () => {
  let component: EstadoProcesoCursoComponent;
  let fixture: ComponentFixture<EstadoProcesoCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoProcesoCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoProcesoCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
