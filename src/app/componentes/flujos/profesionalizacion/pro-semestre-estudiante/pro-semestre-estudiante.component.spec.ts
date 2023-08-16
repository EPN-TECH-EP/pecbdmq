import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSemestreEstudianteComponent } from './pro-semestre-estudiante.component';

describe('ProSemestreEstudianteComponent', () => {
  let component: ProSemestreEstudianteComponent;
  let fixture: ComponentFixture<ProSemestreEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProSemestreEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProSemestreEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
