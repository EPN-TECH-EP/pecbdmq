import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoCursoComponent } from './catalogo-curso.component';

describe('MenuComponent', () => {
  let component: CatalogoCursoComponent;
  let fixture: ComponentFixture<CatalogoCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
