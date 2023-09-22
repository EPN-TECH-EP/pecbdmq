import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioFormacionComponent } from './calendario-formacion.component';

describe('CalendarioFormacionComponent', () => {
  let component: CalendarioFormacionComponent;
  let fixture: ComponentFixture<CalendarioFormacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioFormacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioFormacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
