import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAdmProComponent } from './menu-adm-pro.component';

describe('MenuAdmProComponent', () => {
  let component: MenuAdmProComponent;
  let fixture: ComponentFixture<MenuAdmProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuAdmProComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAdmProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
