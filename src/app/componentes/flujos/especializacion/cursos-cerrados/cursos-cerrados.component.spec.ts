import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosCerradosComponent } from './cursos-cerrados.component';

describe('CursosCerradosComponent', () => {
  let component: CursosCerradosComponent;
  let fixture: ComponentFixture<CursosCerradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursosCerradosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosCerradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
