import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDelegadosEspComponent } from './gestion-delegados-esp.component';

describe('GestionDelegadosComponent', () => {
  let component: GestionDelegadosEspComponent;
  let fixture: ComponentFixture<GestionDelegadosEspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionDelegadosEspComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDelegadosEspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
