import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlujoCapacitacionComponent } from './flujo-capacitacion.component';

describe('FlujoCapacitacionComponent', () => {
  let component: FlujoCapacitacionComponent;
  let fixture: ComponentFixture<FlujoCapacitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlujoCapacitacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlujoCapacitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
