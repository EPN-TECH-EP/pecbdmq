import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProFlujoComponent } from './pro-flujo.component';

describe('ProFlujoComponent', () => {
  let component: ProFlujoComponent;
  let fixture: ComponentFixture<ProFlujoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProFlujoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProFlujoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
