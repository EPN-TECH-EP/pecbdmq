import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProValidacionRequisitosComponent } from './pro-validacion-requisitos.component';

describe('ValidacionComponent', () => {
  let component: ProValidacionRequisitosComponent;
  let fixture: ComponentFixture<ProValidacionRequisitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProValidacionRequisitosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProValidacionRequisitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
