import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInstructorComponent } from './chat-instructor.component';

describe('ChatInstructorComponent', () => {
  let component: ChatInstructorComponent;
  let fixture: ComponentFixture<ChatInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatInstructorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
