import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApelacionComponent } from './modal-apelacion.component';

describe('ModalApelacionComponent', () => {
  let component: ModalApelacionComponent;
  let fixture: ComponentFixture<ModalApelacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalApelacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalApelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
