import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuConsultasComponent } from './menu-consultas.component';

describe('MenuConsultasComponent', () => {
  let component: MenuConsultasComponent;
  let fixture: ComponentFixture<MenuConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuConsultasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
