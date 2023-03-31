import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoEstadosComponent } from './catalogo-estados.component';

describe('CatalogoEstadosComponent', () => {
  let component: CatalogoEstadosComponent;
  let fixture: ComponentFixture<CatalogoEstadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoEstadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
