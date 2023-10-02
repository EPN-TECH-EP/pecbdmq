import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSancionesBomberosComponent } from './modal-sanciones-bomberos.component';

describe('ModalSancionesBomberosComponent', () => {
  let component: ModalSancionesBomberosComponent;
  let fixture: ComponentFixture<ModalSancionesBomberosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSancionesBomberosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSancionesBomberosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
