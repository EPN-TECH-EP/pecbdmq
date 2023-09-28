import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteEvalucionCursoComponent } from './estudiante-evalucion-curso.component';

describe('EstudianteEvalucionCursoComponent', () => {
  let component: EstudianteEvalucionCursoComponent;
  let fixture: ComponentFixture<EstudianteEvalucionCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudianteEvalucionCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteEvalucionCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
