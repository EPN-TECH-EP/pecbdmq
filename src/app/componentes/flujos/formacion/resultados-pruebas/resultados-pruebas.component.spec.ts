import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosPruebasComponent } from './resultados-pruebas.component';

describe('ResultadosPruebasComponent', () => {
  let component: ResultadosPruebasComponent;
  let fixture: ComponentFixture<ResultadosPruebasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadosPruebasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosPruebasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
