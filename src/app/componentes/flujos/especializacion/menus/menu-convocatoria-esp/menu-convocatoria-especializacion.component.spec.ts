import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuConvocatoriaEspecializacionComponent } from './menu-convocatoria-especializacion.component';

describe('MenuConvocatoriaComponent', () => {
  let component: MenuConvocatoriaEspecializacionComponent;
  let fixture: ComponentFixture<MenuConvocatoriaEspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuConvocatoriaEspecializacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuConvocatoriaEspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
