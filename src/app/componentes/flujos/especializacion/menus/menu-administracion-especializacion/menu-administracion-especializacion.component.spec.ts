import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAdministracionEspecializacionComponent } from './menu-administracion-especializacion.component';

describe('MenuAdministracionEspecializacionComponent', () => {
  let component: MenuAdministracionEspecializacionComponent;
  let fixture: ComponentFixture<MenuAdministracionEspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuAdministracionEspecializacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAdministracionEspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
