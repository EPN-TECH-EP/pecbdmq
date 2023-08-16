import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPeriodoSemestreComponent } from './pro-periodo-semestre.component';

describe('ProPeriodoSemestreComponent', () => {
  let component: ProPeriodoSemestreComponent;
  let fixture: ComponentFixture<ProPeriodoSemestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProPeriodoSemestreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProPeriodoSemestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
