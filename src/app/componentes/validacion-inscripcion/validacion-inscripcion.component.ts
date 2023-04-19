import { RequisitoVal } from './../../modelo/requisito-validación';
import { Inscripcion } from './../../modelo/inscripcion';
import { Component, Input, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-validacion-inscripcion',
  templateUrl: './validacion-inscripcion.component.html',
  styleUrls: ['./validacion-inscripcion.component.scss']
})

export class ValidacionInscripcionComponent implements OnInit {

  requisitosVal: RequisitoVal[] = [
    {
        codigo: 1,
        nombre: 'Título de Bachiller',
        documento: true,
        aprobado: false,
        reprobado: true,
        observacion: 'Ninguna',
    },
    {
      codigo: 2,
      nombre: 'Planilla de agua o luz',
      documento: true,
      aprobado: true,
      reprobado: false,
      observacion: 'Ninguna',
    },
    {
      codigo: 3,
      nombre: 'Copia de cédula',
      documento: true,
      aprobado: true,
      reprobado: false,
      observacion: 'Ninguna',
    },
    {
      codigo: 4,
      nombre: 'Copia papeleta de votación',
      documento: true,
      aprobado: true,
      reprobado: false,
      observacion: 'Ninguna',
    },
  ];

  editElementIndex = -1;
  addRow = false;

  codigo: string | null = null;
  cedula: string | null = null;
  apellidos: string | null = null;
  nombres: string | null = null;
  email: string | null = null;
  sexo: string | null = null;
  fechaNacimiento: string | null = null;
  telCelular: string | null = null;
  telConvencional: string | null = null;
  nacionalidad: string | null = null;
  provinciaNacimiento: string | null = null;
  cantonNacimiento: string | null = null;
  provinciaResidencia: string | null = null;
  cantonResidencia: string | null = null;
  direccionActual: string | null = null;
  callePrincipal: string | null = null;
  calleSecundaria: string | null = null;
  numeroCasa: string | null = null;
  paisTitulo: string | null = null;
  ciudadTitulo: string | null = null;
  colegioTitulo: string | null = null;
  nombreTitulo: string | null = null;
  meritoAcademico: string | null = null;
  meritoDeportivo: string | null = null;
  pinSeguridad: string | null = null;
  estado: string | null = null;
  fechaInscripcion: string | null = null;

  @Input() inscripciones: any[]; // aquí se recibe el array
  constructor(public modalRef: MdbModalRef<ValidacionInscripcionComponent>) {
  }
  headers = [
    'Requisito',
    'Documento?',
    'Aprodado?',
    'Reprodado?',
    'Observaciones'
  ]
  downloadFile() {
    const fileUrl = '../../../assets/EXPEDIENTE DE EJEMPLO.pdf';
    window.open(fileUrl, '_blank');
  }
  ngOnInit(): void {
  }

}
