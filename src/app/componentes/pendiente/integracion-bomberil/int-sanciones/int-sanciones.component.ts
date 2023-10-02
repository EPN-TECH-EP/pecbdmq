import { Component, OnInit } from '@angular/core';
import {Funcionario, FuncionarioService} from "../services/funcionario.service";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {Notificacion} from "../../../../util/notificacion";
import {
  ModalCargaReconocimientoComponent
} from "../util/modal-carga-reconocimiento/modal-carga-reconocimiento.component";
import {ModalSancionesBomberosComponent} from "../util/modal-sanciones-bomberos/modal-sanciones-bomberos.component";

@Component({
  selector: 'app-int-sanciones',
  templateUrl: './int-sanciones.component.html',
  styleUrls: ['./int-sanciones.component.scss']
})
export class IntSancionesComponent implements OnInit {
  funcionarios: Funcionario[];
  modalRef: MdbModalRef<ModalSancionesBomberosComponent> | null = null;

  headers: { label: string; key: string; }[];
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

  abrirModalSanciones(funcionario: Funcionario) {
    console.log(funcionario);
    this.modalRef = this.modalService.open(ModalSancionesBomberosComponent, {
      data: {
        funcionario: funcionario,
      },
      modalClass: 'modal-lg modal-dialog-centered',
    });
  }


}
