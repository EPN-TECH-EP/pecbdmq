import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNotasComponent } from './menu-notas.component';

describe('MenuNotasComponent', () => {
  let component: MenuNotasComponent;
  let fixture: ComponentFixture<MenuNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuNotasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
