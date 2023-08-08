import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuReportesEspComponent } from './menu-reportes-esp.component';

describe('MenuReportesEspComponent', () => {
  let component: MenuReportesEspComponent;
  let fixture: ComponentFixture<MenuReportesEspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuReportesEspComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuReportesEspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
