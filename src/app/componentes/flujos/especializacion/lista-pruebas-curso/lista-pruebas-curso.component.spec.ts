import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPruebasCursoComponent } from './lista-pruebas-curso.component';

describe('ListaPruebasCursoComponent', () => {
  let component: ListaPruebasCursoComponent;
  let fixture: ComponentFixture<ListaPruebasCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPruebasCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPruebasCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
