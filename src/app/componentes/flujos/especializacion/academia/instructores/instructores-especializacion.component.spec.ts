import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructoresEspecializacionComponent } from './instructores-especializacion.component';

describe('InstructoresEspecializacionComponent', () => {
  let component: InstructoresEspecializacionComponent;
  let fixture: ComponentFixture<InstructoresEspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructoresEspecializacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructoresEspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
