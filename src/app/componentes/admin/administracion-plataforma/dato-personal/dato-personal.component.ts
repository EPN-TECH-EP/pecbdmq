import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-dato-personal',
  templateUrl: './dato-personal.component.html',
  styleUrls: ['./dato-personal.component.scss']
})
export class DatoPersonalComponent implements OnInit {

  formularioDatoPersonal: FormGroup;

  constructor(
    public modalRef: MdbModalRef<DatoPersonalComponent>,
    private builder: FormBuilder
  ) {
    this.formularioDatoPersonal = new FormGroup({});
  }

  ngOnInit(): void {
    this.construirFormulario();
  }

  private construirFormulario() {
    this.formularioDatoPersonal = this.builder.group({

      apellido:                     [],
      cedula:                       [],
      correoPersonal:              [],
      fechaNacimiento:             [],
      nombre:                       [],
      telfConvencional:       [],
      tipoSangre:                  [],
      provinciaNacimiento:     [],
      unidadGestion:           [],
      genero:                       [],
      telfCelular:            [],
      cantonNacimiento:            [],
      residePais:                  [],
      provinciaResidencia:     [],
      cantonResidencia:            [],
      callePrincipalResidencia:   [],
      calleSecundariaResidencia:  [],
      numeroCasa:                  [],
      colegio:                      [],
      tipoNacionalidad:            [],
      tieneMeritoDeportivo:       [],
      tieneMeritoAcademico:       [],
      nombreTitulo:                [],
      paisTitulo:                  [],
      ciudadTitulo:                [],
      meritoDeportivoDescripcion: [],
      meritoAcademicoDescripcion: [],
    });
  }

}
