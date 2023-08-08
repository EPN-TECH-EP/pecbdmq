import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPruebasEspecializacionComponent } from './menu-pruebas-especializacion.component';

describe('MenuPruebasComponent', () => {
  let component: MenuPruebasEspecializacionComponent;
  let fixture: ComponentFixture<MenuPruebasEspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuPruebasEspecializacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPruebasEspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
