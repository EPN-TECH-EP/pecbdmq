import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamamientoFichaComponent } from './llamamiento-ficha.component';

describe('LlamamientoFichaComponent', () => {
  let component: LlamamientoFichaComponent;
  let fixture: ComponentFixture<LlamamientoFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LlamamientoFichaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlamamientoFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
