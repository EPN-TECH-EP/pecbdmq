import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCalculoNotaFinalComponent } from './menu-calculo-nota-final.component';

describe('MenuCalculoNotaFinalComponent', () => {
  let component: MenuCalculoNotaFinalComponent;
  let fixture: ComponentFixture<MenuCalculoNotaFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuCalculoNotaFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCalculoNotaFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
