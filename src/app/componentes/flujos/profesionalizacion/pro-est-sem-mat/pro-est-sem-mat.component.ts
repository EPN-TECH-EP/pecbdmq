import { Component, OnInit } from '@angular/core';
import ServiceTypeEnum from '../../../../enum/service-type.enum';

@Component({
  selector: 'app-pro-est-sem-mat',
  templateUrl: './pro-est-sem-mat.component.html',
  styleUrls: ['./pro-est-sem-mat.component.scss']
})
export class ProEstSemMatComponent implements OnInit {
  protected readonly type = ServiceTypeEnum.ESTUDIANTE_SEMESTRE_MATERIA;

  constructor() { }

  ngOnInit(): void {
  }

}
