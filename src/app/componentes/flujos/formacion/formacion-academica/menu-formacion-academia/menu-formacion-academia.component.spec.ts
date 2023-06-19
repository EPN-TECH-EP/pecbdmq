import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFormacionAcademiaComponent } from './menu-formacion-academia.component';

describe('MenuFormacionAcademiaComponent', () => {
  let component: MenuFormacionAcademiaComponent;
  let fixture: ComponentFixture<MenuFormacionAcademiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuFormacionAcademiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuFormacionAcademiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
