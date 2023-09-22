import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositorioMateriaEstudianteComponent } from './repositorio-materia-estudiante.component';

describe('RepositorioMateriaEstudianteComponent', () => {
  let component: RepositorioMateriaEstudianteComponent;
  let fixture: ComponentFixture<RepositorioMateriaEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepositorioMateriaEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepositorioMateriaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
