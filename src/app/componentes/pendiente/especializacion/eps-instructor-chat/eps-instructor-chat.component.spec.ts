import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpsInstructorChatComponent } from './eps-instructor-chat.component';

describe('EpsInstructorChatComponent', () => {
  let component: EpsInstructorChatComponent;
  let fixture: ComponentFixture<EpsInstructorChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpsInstructorChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpsInstructorChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
