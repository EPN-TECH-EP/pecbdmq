import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloEstadosComponent } from './modulo-estados.component';

describe('ModuloEstadosComponent', () => {
  let component: ModuloEstadosComponent;
  let fixture: ComponentFixture<ModuloEstadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloEstadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
