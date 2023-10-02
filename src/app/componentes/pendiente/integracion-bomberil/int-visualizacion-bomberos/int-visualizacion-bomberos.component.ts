import { Component, OnInit } from '@angular/core';
import {Funcionario, FuncionarioService} from "../services/funcionario.service";

@Component({
  selector: 'app-int-visualizacion-bomberos',
  templateUrl: './int-visualizacion-bomberos.component.html',
  styleUrls: ['./int-visualizacion-bomberos.component.scss']
})
export class IntVisualizacionBomberosComponent implements OnInit {

  funcionarios: Funcionario[]
  headers: { label: string; key: string; }[];

  constructor(private funcionariosService: FuncionarioService) {
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
    this.funcionariosService.listar().subscribe({
      next: funcionarios => {
        this.funcionarios = funcionarios;
        console.log(this.funcionarios);
      }
    })
  }

}
