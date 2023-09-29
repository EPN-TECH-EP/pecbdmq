import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntNotificacionLlamamientoComponent } from './int-notificacion-llamamiento.component';

describe('IntNotificacionLlamamientoComponent', () => {
  let component: IntNotificacionLlamamientoComponent;
  let fixture: ComponentFixture<IntNotificacionLlamamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntNotificacionLlamamientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntNotificacionLlamamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
