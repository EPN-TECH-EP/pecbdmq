import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntSancionesComponent } from './int-sanciones.component';

describe('IntSancionesComponent', () => {
  let component: IntSancionesComponent;
  let fixture: ComponentFixture<IntSancionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntSancionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntSancionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
