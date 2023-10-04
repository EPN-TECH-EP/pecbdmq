import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpsRepoEstudianteComponent } from './eps-repo-estudiante.component';

describe('EpsRepoEstudianteComponent', () => {
  let component: EpsRepoEstudianteComponent;
  let fixture: ComponentFixture<EpsRepoEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpsRepoEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpsRepoEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
