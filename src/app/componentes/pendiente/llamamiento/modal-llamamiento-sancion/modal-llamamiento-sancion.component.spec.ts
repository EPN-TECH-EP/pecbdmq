import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLlamamientoSancionComponent } from './modal-llamamiento-sancion.component';

describe('ModalLlamamientoSancionComponent', () => {
  let component: ModalLlamamientoSancionComponent;
  let fixture: ComponentFixture<ModalLlamamientoSancionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLlamamientoSancionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLlamamientoSancionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
