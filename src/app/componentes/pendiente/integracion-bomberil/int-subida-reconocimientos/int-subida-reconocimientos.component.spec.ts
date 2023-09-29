import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntSubidaReconocimientosComponent } from './int-subida-reconocimientos.component';

describe('IntSubidaReconocimientosComponent', () => {
  let component: IntSubidaReconocimientosComponent;
  let fixture: ComponentFixture<IntSubidaReconocimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntSubidaReconocimientosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntSubidaReconocimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
