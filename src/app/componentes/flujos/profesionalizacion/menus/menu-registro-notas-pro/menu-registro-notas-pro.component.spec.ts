import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRegistroNotasProComponent } from './menu-registro-notas-pro.component';

describe('MenuRegistroNotasProComponent', () => {
  let component: MenuRegistroNotasProComponent;
  let fixture: ComponentFixture<MenuRegistroNotasProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuRegistroNotasProComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuRegistroNotasProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
