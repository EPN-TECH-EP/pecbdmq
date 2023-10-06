import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapArchivosComponent } from './cap-archivos.component';

describe('CapArchivosComponent', () => {
  let component: CapArchivosComponent;
  let fixture: ComponentFixture<CapArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapArchivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
