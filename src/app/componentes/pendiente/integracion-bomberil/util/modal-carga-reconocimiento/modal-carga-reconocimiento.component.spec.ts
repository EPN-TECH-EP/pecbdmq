import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCargaReconocimientoComponent } from './modal-carga-reconocimiento.component';

describe('ModalCargaReconocimientoComponent', () => {
  let component: ModalCargaReconocimientoComponent;
  let fixture: ComponentFixture<ModalCargaReconocimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCargaReconocimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCargaReconocimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
