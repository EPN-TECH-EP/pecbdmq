import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForRepoMateriaComponent } from './for-repo-materia.component';

describe('ForRepoMateriaComponent', () => {
  let component: ForRepoMateriaComponent;
  let fixture: ComponentFixture<ForRepoMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForRepoMateriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForRepoMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
