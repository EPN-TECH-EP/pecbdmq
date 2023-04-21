import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoFormacionComponent } from './proceso-formacion.component';

describe('ProcesoFormacionComponent', () => {
  let component: ProcesoFormacionComponent;
  let fixture: ComponentFixture<ProcesoFormacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesoFormacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesoFormacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
