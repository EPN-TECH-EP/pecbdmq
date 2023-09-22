import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLlamamientoRequisitosComponent } from './modal-llamamiento-requisitos.component';

describe('ModalLlamamientoRequisitosComponent', () => {
  let component: ModalLlamamientoRequisitosComponent;
  let fixture: ComponentFixture<ModalLlamamientoRequisitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLlamamientoRequisitosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLlamamientoRequisitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
