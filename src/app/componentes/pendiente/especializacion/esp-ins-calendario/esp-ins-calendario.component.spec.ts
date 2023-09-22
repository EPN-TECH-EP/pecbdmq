import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspInsCalendarioComponent } from './esp-ins-calendario.component';

describe('EspInsCalendarioComponent', () => {
  let component: EspInsCalendarioComponent;
  let fixture: ComponentFixture<EspInsCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspInsCalendarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspInsCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
