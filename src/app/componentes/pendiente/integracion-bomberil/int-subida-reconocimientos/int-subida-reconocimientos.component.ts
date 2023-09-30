import {Component, OnInit} from '@angular/core';
import {Funcionario, FuncionarioService} from "../services/funcionario.service";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {
  ModalCargaReconocimientoComponent
} from "../util/modal-carga-reconocimiento/modal-carga-reconocimiento.component";

@Component({
  selector: 'app-int-subida-reconocimientos',
  templateUrl: './int-subida-reconocimientos.component.html',
  styleUrls: ['./int-subida-reconocimientos.component.scss']
})
export class IntSubidaReconocimientosComponent implements OnInit {

  modalRef: MdbModalRef<ModalCargaReconocimientoComponent> | null = null;


  funcionarios: Funcionario[];
  headers: { label: string; key: string; }[];

  constructor(private funcionarioService: FuncionarioService, private modalService: MdbModalService) {
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

  abrirModalReconocimiento(funcionario: Funcionario) {
    console.log(funcionario);
    this.modalRef = this.modalService.open(ModalCargaReconocimientoComponent, {
      data: {
        funcionario: funcionario,
      },
      modalClass: 'modal-lg modal-dialog-centered',
    });
  }
}
