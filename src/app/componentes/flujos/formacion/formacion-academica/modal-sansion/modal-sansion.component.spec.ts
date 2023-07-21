import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSansionComponent } from './modal-sansion.component';

describe('ModalSansionComponent', () => {
  let component: ModalSansionComponent;
  let fixture: ComponentFixture<ModalSansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSansionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
