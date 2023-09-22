import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioInstructorComponent } from './calendario-instructor.component';

describe('CalendarioInstructorComponent', () => {
  let component: CalendarioInstructorComponent;
  let fixture: ComponentFixture<CalendarioInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioInstructorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
