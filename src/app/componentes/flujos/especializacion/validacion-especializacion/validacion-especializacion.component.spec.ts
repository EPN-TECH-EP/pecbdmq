import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionEspecializacionComponent } from './validacion-especializacion.component';

describe('ValidacionComponent', () => {
  let component: ValidacionEspecializacionComponent;
  let fixture: ComponentFixture<ValidacionEspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidacionEspecializacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidacionEspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
