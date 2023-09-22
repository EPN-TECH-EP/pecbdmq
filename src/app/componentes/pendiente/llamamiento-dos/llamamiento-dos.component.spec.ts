import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamamientoDosComponent } from './llamamiento-dos.component';

describe('LlamamientoDosComponent', () => {
  let component: LlamamientoDosComponent;
  let fixture: ComponentFixture<LlamamientoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LlamamientoDosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlamamientoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
