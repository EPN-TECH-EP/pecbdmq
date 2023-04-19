import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AconvocatoriaComponent } from './aconvocatoria.component';

describe('AconvocatoriaComponent', () => {
  let component: AconvocatoriaComponent;
  let fixture: ComponentFixture<AconvocatoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AconvocatoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AconvocatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
