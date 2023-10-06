import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapNotasComponent } from './cap-notas.component';

describe('CapNotasComponent', () => {
  let component: CapNotasComponent;
  let fixture: ComponentFixture<CapNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapNotasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
