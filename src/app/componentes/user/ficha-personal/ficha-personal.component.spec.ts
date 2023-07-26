import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaPersonalComponent } from './ficha-personal.component';

describe('FichaPersonalComponent', () => {
  let component: FichaPersonalComponent;
  let fixture: ComponentFixture<FichaPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaPersonalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
