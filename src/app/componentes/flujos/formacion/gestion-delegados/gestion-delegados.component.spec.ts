import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDelegadosComponent } from './gestion-delegados.component';

describe('GestionDelegadosComponent', () => {
  let component: GestionDelegadosComponent;
  let fixture: ComponentFixture<GestionDelegadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionDelegadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDelegadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
