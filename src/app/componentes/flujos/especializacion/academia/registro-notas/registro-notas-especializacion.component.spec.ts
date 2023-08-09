import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroNotasEspecializacionComponent } from './registro-notas-especializacion.component';

describe('RegistroNotasComponent', () => {
  let component: RegistroNotasEspecializacionComponent;
  let fixture: ComponentFixture<RegistroNotasEspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroNotasEspecializacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroNotasEspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
