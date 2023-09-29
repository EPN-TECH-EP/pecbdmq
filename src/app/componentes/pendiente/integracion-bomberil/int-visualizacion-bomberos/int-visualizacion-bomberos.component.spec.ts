import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntVisualizacionBomberosComponent } from './int-visualizacion-bomberos.component';

describe('IntVisualizacionBomberosComponent', () => {
  let component: IntVisualizacionBomberosComponent;
  let fixture: ComponentFixture<IntVisualizacionBomberosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntVisualizacionBomberosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntVisualizacionBomberosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
