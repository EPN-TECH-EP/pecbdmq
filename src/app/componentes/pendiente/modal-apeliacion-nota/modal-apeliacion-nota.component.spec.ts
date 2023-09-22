import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApeliacionNotaComponent } from './modal-apeliacion-nota.component';

describe('ModalApeliacionNotaComponent', () => {
  let component: ModalApeliacionNotaComponent;
  let fixture: ComponentFixture<ModalApeliacionNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalApeliacionNotaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalApeliacionNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
