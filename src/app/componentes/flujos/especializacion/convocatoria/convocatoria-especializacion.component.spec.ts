import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocatoriaEspecializacionComponent } from './convocatoria-especializacion.component';

describe('ConvocatoriaComponent', () => {
  let component: ConvocatoriaEspecializacionComponent;
  let fixture: ComponentFixture<ConvocatoriaEspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvocatoriaEspecializacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocatoriaEspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
