import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoEvaluacionesComponent } from './curso-evaluaciones.component';

describe('CursoEvaluacionesComponent', () => {
  let component: CursoEvaluacionesComponent;
  let fixture: ComponentFixture<CursoEvaluacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoEvaluacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursoEvaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
