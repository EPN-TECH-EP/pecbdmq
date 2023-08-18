import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuReportesProComponent } from './menu-reportes-pro.component';

describe('MenuReportesProComponent', () => {
  let component: MenuReportesProComponent;
  let fixture: ComponentFixture<MenuReportesProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuReportesProComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuReportesProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
