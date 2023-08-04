import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosPruebasCursoComponent } from './resultados-pruebas-curso.component';

describe('ResultadosPruebasCursoComponent', () => {
  let component: ResultadosPruebasCursoComponent;
  let fixture: ComponentFixture<ResultadosPruebasCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadosPruebasCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosPruebasCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
