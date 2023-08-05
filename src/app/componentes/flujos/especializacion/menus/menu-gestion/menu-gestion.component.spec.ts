import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGestionComponent } from './menu-gestion.component';

describe('MenuGestionComponent', () => {
  let component: MenuGestionComponent;
  let fixture: ComponentFixture<MenuGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuGestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
