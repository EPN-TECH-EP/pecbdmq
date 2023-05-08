import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatoPersonalComponent } from './dato-personal.component';

describe('DatoPersonalComponent', () => {
  let component: DatoPersonalComponent;
  let fixture: ComponentFixture<DatoPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatoPersonalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatoPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
