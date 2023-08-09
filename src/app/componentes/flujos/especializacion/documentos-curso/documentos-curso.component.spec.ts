import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosCursoComponent } from './documentos-curso.component';

describe('DocumentosCursoComponent', () => {
  let component: DocumentosCursoComponent;
  let fixture: ComponentFixture<DocumentosCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentosCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
