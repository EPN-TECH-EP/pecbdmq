import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonderacionComponent } from './ponderacion.component';

describe('PonderacionComponent', () => {
  let component: PonderacionComponent;
  let fixture: ComponentFixture<PonderacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PonderacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonderacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
