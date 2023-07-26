import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteNotaFormacion } from './componente-nota-formacion.component';

describe('ComponeneteNotaComponent', () => {
  let component: ComponenteNotaFormacion;
  let fixture: ComponentFixture<ComponenteNotaFormacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteNotaFormacion ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteNotaFormacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
