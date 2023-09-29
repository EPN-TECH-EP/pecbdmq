import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntListaHonorComponent } from './int-lista-honor.component';

describe('IntListaHonorComponent', () => {
  let component: IntListaHonorComponent;
  let fixture: ComponentFixture<IntListaHonorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntListaHonorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntListaHonorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
