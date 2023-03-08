import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPruebaComponent } from './tipo-prueba.component';

describe('TipoPruebaComponent', () => {
  let component: TipoPruebaComponent;
  let fixture: ComponentFixture<TipoPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoPruebaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
