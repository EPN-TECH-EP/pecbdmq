import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPruebasComponent } from './lista-pruebas.component';

describe('ListaPruebasComponent', () => {
  let component: ListaPruebasComponent;
  let fixture: ComponentFixture<ListaPruebasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPruebasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPruebasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
