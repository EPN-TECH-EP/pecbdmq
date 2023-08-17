import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuValidacionProComponent } from './menu-validacion-pro.component';

describe('MenuValidacionProComponent', () => {
  let component: MenuValidacionProComponent;
  let fixture: ComponentFixture<MenuValidacionProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuValidacionProComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuValidacionProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
