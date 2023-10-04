import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForRepoEstudianteComponent } from './for-repo-estudiante.component';

describe('ForRepoEstudianteComponent', () => {
  let component: ForRepoEstudianteComponent;
  let fixture: ComponentFixture<ForRepoEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForRepoEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForRepoEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
