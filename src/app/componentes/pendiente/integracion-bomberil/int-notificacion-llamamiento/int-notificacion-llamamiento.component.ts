import { Component, OnInit } from '@angular/core';
import {Funcionario, FuncionarioService} from "../services/funcionario.service";
import {MdbModalService} from "mdb-angular-ui-kit/modal";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {Notificacion} from "../../../../util/notificacion";

@Component({
  selector: 'app-int-notificacion-llamamiento',
  templateUrl: './int-notificacion-llamamiento.component.html',
  styleUrls: ['./int-notificacion-llamamiento.component.scss']
})
export class IntNotificacionLlamamientoComponent implements OnInit {
  funcionarios: Funcionario[];
  headers: { label: string; key: string; }[];
  cantidad: number;
  esNotificaionEnviada: boolean;

  constructor(
    private funcionarioService: FuncionarioService,
    private modalService: MdbModalService,
    private ns: MdbNotificationService) {
    this.esNotificaionEnviada = false;
    this.funcionarios = [];
    this.headers = [
      {label: 'Nombres', key: 'nombres'},
      {label: 'Apellidos', key: 'apellidos'},
      {label: 'Email', key: 'email'},
      {label: 'Operativo', key: 'operativo'},
      {label: 'Fecha de ingreso', key: 'fechaIngreso'},
      {label: 'Agrupación', key: 'agrupacion'},
      {label: 'Tipo', key: 'type'},
    ];
  }

  ngOnInit(): void {
    this.funcionarioService.listar().subscribe({
      next: funcionarios => {
        this.funcionarios = funcionarios;
        console.log(this.funcionarios);
      }
    });
  }

  private mostrarNotificacion(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
  }

  enviarNotificacionesLlamamientoII() {
    this.esNotificaionEnviada = true;
    this.funcionarioService.enviarNotificacionMejoresProspectos(this.cantidad).subscribe({
      next: () => {
        this.mostrarNotificacion('Notificaciones enviadas', TipoAlerta.ALERTA_OK);
        this.cantidad = 0;
        this.esNotificaionEnviada = false;

      },
      error: (err) => {
        this.mostrarNotificacion('Error al enviar las notificaciones', TipoAlerta.ALERTA_ERROR);
        console.error(err)
      }
    })
  }

}
