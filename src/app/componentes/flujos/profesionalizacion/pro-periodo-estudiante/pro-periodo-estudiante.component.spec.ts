import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPeriodoEstudianteComponent } from './pro-periodo-estudiante.component';

describe('ProPeriodoEstudianteComponent', () => {
  let component: ProPeriodoEstudianteComponent;
  let fixture: ComponentFixture<ProPeriodoEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProPeriodoEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProPeriodoEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
