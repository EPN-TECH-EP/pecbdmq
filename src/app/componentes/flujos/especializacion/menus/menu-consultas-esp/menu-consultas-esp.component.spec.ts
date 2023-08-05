import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuConsultasEspComponent } from './menu-consultas-esp.component';

describe('MenuConsultasEspComponent', () => {
  let component: MenuConsultasEspComponent;
  let fixture: ComponentFixture<MenuConsultasEspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuConsultasEspComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuConsultasEspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
