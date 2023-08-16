import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSemestreMateriaComponent } from './pro-semestre-materia.component';

describe('ProSemestreMateriaComponent', () => {
  let component: ProSemestreMateriaComponent;
  let fixture: ComponentFixture<ProSemestreMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProSemestreMateriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProSemestreMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
