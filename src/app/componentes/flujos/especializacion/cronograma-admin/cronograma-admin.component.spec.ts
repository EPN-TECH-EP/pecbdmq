import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronogramaAdminComponent } from './cronograma-admin.component';

describe('CronogramaAdminComponent', () => {
  let component: CronogramaAdminComponent;
  let fixture: ComponentFixture<CronogramaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CronogramaAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronogramaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
