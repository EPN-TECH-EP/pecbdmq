import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuValidacionComponent } from './menu-validacion.component';

describe('MenuValidacionComponent', () => {
  let component: MenuValidacionComponent;
  let fixture: ComponentFixture<MenuValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuValidacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
