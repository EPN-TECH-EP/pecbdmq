import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapMenuPrincipalComponent } from './cap-menu-principal.component';

describe('CapMenuPrincipalComponent', () => {
  let component: CapMenuPrincipalComponent;
  let fixture: ComponentFixture<CapMenuPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapMenuPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapMenuPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
