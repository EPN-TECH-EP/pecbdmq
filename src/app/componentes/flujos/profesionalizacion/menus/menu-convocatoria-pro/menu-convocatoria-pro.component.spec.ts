import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuConvocatoriaProComponent } from './menu-convocatoria-pro.component';

describe('MenuConvocatoriaProComponent', () => {
  let component: MenuConvocatoriaProComponent;
  let fixture: ComponentFixture<MenuConvocatoriaProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuConvocatoriaProComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuConvocatoriaProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
