import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProParaleloInstructorComponent } from './pro-paralelo-instructor.component';

describe('ProParaleloInstructorComponent', () => {
  let component: ProParaleloInstructorComponent;
  let fixture: ComponentFixture<ProParaleloInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProParaleloInstructorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProParaleloInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
