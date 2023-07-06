import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtipoParametrosComponent } from './subtipo-parametros.component';

describe('SubtipoParametrosComponent', () => {
  let component: SubtipoParametrosComponent;
  let fixture: ComponentFixture<SubtipoParametrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtipoParametrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtipoParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
