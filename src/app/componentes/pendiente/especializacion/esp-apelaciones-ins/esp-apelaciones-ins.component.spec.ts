import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspApelacionesInsComponent } from './esp-apelaciones-ins.component';

describe('EspApelacionesInsComponent', () => {
  let component: EspApelacionesInsComponent;
  let fixture: ComponentFixture<EspApelacionesInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspApelacionesInsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspApelacionesInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
