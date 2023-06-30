import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuestraComponent } from './muestra.component';

describe('MuestraComponent', () => {
  let component: MuestraComponent;
  let fixture: ComponentFixture<MuestraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuestraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuestraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
