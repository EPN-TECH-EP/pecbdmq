import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocatoriaAComponent } from './convocatoria-a.component';

describe('ConvocatoriaAComponent', () => {
  let component: ConvocatoriaAComponent;
  let fixture: ComponentFixture<ConvocatoriaAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvocatoriaAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvocatoriaAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
