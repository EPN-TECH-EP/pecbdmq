import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApelacionesComponent } from './apelaciones.component';

describe('ApelacionesComponent', () => {
  let component: ApelacionesComponent;
  let fixture: ComponentFixture<ApelacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApelacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApelacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
