import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntAscensosComponent } from './int-ascensos.component';

describe('IntAscensosComponent', () => {
  let component: IntAscensosComponent;
  let fixture: ComponentFixture<IntAscensosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntAscensosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntAscensosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
