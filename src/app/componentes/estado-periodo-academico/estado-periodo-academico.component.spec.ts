import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoPeriodoAcademicoComponent } from './estado-periodo-academico.component';

describe('EstadoPeriodoAcademicoComponent', () => {
  let component: EstadoPeriodoAcademicoComponent;
  let fixture: ComponentFixture<EstadoPeriodoAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoPeriodoAcademicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoPeriodoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
