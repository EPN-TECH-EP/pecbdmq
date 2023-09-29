import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntCapacitacionEmpresarialComponent } from './int-capacitacion-empresarial.component';

describe('IntCapacitacionEmpresarialComponent', () => {
  let component: IntCapacitacionEmpresarialComponent;
  let fixture: ComponentFixture<IntCapacitacionEmpresarialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntCapacitacionEmpresarialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntCapacitacionEmpresarialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
