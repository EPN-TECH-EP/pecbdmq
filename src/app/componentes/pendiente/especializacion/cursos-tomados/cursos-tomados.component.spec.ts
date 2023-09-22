import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosTomadosComponent } from './cursos-tomados.component';

describe('CursosTomadosComponent', () => {
  let component: CursosTomadosComponent;
  let fixture: ComponentFixture<CursosTomadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursosTomadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosTomadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
