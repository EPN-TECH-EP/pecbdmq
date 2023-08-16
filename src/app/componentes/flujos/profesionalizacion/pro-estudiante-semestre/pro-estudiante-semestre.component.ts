import { Component, OnInit } from '@angular/core';
import ServiceTypeEnum from '../../../../enum/service-type.enum';

@Component({
  selector: 'app-pro-estudiante-semestre',
  templateUrl: './pro-estudiante-semestre.component.html',
  styleUrls: ['./pro-estudiante-semestre.component.scss']
})
export class ProEstudianteSemestreComponent implements OnInit {
  protected readonly type = ServiceTypeEnum.ESTUDIANTE_SEMESTRE;

  constructor() { }

  ngOnInit(): void {
  }

}
