import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionCursoComponent } from './validacion-curso.component';

describe('ValidacionCursoComponent', () => {
  let component: ValidacionCursoComponent;
  let fixture: ComponentFixture<ValidacionCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidacionCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidacionCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
