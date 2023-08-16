import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProProyectoFormularioComponent } from './pro-proyecto-formulario.component';

describe('ProProyectoFormularioComponent', () => {
  let component: ProProyectoFormularioComponent;
  let fixture: ComponentFixture<ProProyectoFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProProyectoFormularioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProProyectoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
