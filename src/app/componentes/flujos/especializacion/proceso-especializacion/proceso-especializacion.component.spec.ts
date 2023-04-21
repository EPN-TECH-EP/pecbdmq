import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoEspecializacionComponent } from './proceso-especializacion.component';

describe('ProcesoEspecializacionComponent', () => {
  let component: ProcesoEspecializacionComponent;
  let fixture: ComponentFixture<ProcesoEspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesoEspecializacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesoEspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
