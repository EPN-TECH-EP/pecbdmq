import { EstadoPeriodoAcademico } from '../../modelo/admin/estado-periodo-academico';
import { Component, OnInit } from '@angular/core';
import { MdbNotificationRef } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estado-periodo-academico',
  templateUrl: './estado-periodo-academico.component.html',
  styleUrls: ['./estado-periodo-academico.component.scss']
})
export class EstadoPeriodoAcademicoComponent implements OnInit {
 //model
 EstadosPeriodoAcademico: EstadoPeriodoAcademico[];
 EstadoPeriodoAcademico: EstadoPeriodoAcademico;
 EstadoPeriodoAcademicoEditForm: EstadoPeriodoAcademico;
 //utils
 notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
 private subscriptions: Subscription[];
 public showLoading: boolean;
  constructor() { }


  ngOnInit(): void {

  }

  //obtener estado actual periodo academico

  //obtener estados de periodo académico

  //actualizar estado periodo académico

}
