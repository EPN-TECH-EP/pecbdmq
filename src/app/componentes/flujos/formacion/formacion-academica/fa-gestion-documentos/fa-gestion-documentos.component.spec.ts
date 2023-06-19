import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaGestionDocumentosComponent } from './fa-gestion-documentos.component';

describe('FaGestionDocumentosComponent', () => {
  let component: FaGestionDocumentosComponent;
  let fixture: ComponentFixture<FaGestionDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaGestionDocumentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaGestionDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
