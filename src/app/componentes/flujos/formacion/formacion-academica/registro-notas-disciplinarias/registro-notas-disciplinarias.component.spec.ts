import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroNotasDisciplinariasComponent } from './registro-notas-disciplinarias.component';

describe('RegistroNotasDisciplinariasComponent', () => {
  let component: RegistroNotasDisciplinariasComponent;
  let fixture: ComponentFixture<RegistroNotasDisciplinariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroNotasDisciplinariasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroNotasDisciplinariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
