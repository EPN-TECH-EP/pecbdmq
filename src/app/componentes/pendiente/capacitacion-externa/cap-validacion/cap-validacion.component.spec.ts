import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapValidacionComponent } from './cap-validacion.component';

describe('CapValidacionComponent', () => {
  let component: CapValidacionComponent;
  let fixture: ComponentFixture<CapValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapValidacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
