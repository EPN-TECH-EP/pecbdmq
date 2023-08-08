import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEspecializacionAcademiaComponent } from './menu-especializacion-academia.component';

describe('MenuEspecializacionAcademiaComponent', () => {
  let component: MenuEspecializacionAcademiaComponent;
  let fixture: ComponentFixture<MenuEspecializacionAcademiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuEspecializacionAcademiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuEspecializacionAcademiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
