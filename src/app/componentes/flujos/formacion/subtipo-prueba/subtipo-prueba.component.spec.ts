import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtipoPruebaComponent } from './subtipo-prueba.component';

describe('SubtipoPruebaComponent', () => {
  let component: SubtipoPruebaComponent;
  let fixture: ComponentFixture<SubtipoPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtipoPruebaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtipoPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
