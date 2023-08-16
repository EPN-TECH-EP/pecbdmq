import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteNotasComponent } from './reporte-notas.component';

describe('ReporteNotasComponent', () => {
  let component: ReporteNotasComponent;
  let fixture: ComponentFixture<ReporteNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteNotasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
