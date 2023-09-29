import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntMenuPrincipalComponent } from './int-menu-principal.component';

describe('IntMenuPrincipalComponent', () => {
  let component: IntMenuPrincipalComponent;
  let fixture: ComponentFixture<IntMenuPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntMenuPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntMenuPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
