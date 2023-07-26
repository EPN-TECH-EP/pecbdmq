import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoModuloComponent } from './historico-modulo.component';

describe('HistoricoModuloComponent', () => {
  let component: HistoricoModuloComponent;
  let fixture: ComponentFixture<HistoricoModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoModuloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
