import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasEstudiantesComponent } from './notas-estudiantes.component';

describe('NotasEstudiantesComponent', () => {
  let component: NotasEstudiantesComponent;
  let fixture: ComponentFixture<NotasEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotasEstudiantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
