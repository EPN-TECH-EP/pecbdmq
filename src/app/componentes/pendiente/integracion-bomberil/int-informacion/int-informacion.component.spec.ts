import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntInformacionComponent } from './int-informacion.component';

describe('IntInformacionComponent', () => {
  let component: IntInformacionComponent;
  let fixture: ComponentFixture<IntInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntInformacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
