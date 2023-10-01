import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteGenericoComponent } from './reporte-generico.component';

describe('ReporteGenericoComponent', () => {
  let component: ReporteGenericoComponent;
  let fixture: ComponentFixture<ReporteGenericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteGenericoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
