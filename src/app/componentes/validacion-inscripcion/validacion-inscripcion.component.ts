import { Inscripcion } from './../../modelo/inscripcion';
import { Component, Input, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Requisito } from 'src/app/modelo/requisito';
@Component({
  selector: 'app-validacion-inscripcion',
  templateUrl: './validacion-inscripcion.component.html',
  styleUrls: ['./validacion-inscripcion.component.scss']
})

export class ValidacionInscripcionComponent implements OnInit {
   requisitos: Inscripcion[] = [
  {
      codigo: 1,
      cedula: 1234567891,
      apellidos: 'Campos Torres',
      nombres: 'Lucas Alfonso',
      email: 'l.alfonso@gmail.com',
      sexo: 'MASCULINO',
      fechaNacimiento: '2004/06/03',
      telCelular: '0939745261',
      telConvencional: '3112929',
      nacionalidad: 'Nacido Ecuador',
      provinciaNacimiento: 'Pichincha',
      cantonNacimiento: 'Quito',
      provinciaResidencia:  'Pichincha',
      cantonResidencia: 'Quito',
      direccionActual: 'Pasaje 15, Juan Camacaro',
      callePrincipal: 'Juan Camacaro',
      calleSecundaria: 'Pasaje 15',
      numeroCasa: '10',
      paisTitulo: 'Ecuador',
      ciudadTitulo: 'Quito',
      colegioTitulo: 'Benito Juarez',
      nombreTitulo: 'Bachillerato General Unificado',
      meritoAcademico: '',
      meritoDeportivo: '',
      pinSeguridad: 257612,
      estado: 'ACTIVO',
      fechaInscripcion:'2023/15/04'
  },
  {
    codigo: 2,
      cedula: 1633425561,
      apellidos: 'Nuñez Velásquez',
      nombres: 'Guadalupe Lucía',
      email: 'lucian@gmail.com',
      sexo: 'FEMENINO',
      fechaNacimiento: '1997/09/23',
      telCelular: '0923456722',
      telConvencional: '22123432',
      nacionalidad: 'Nacido Ecuador',
      provinciaNacimiento: 'Esmeraldas',
      cantonNacimiento: 'Esmeraldas',
      provinciaResidencia:  'Guayas',
      cantonResidencia: 'Duran',
      direccionActual: 'Avenida de la Virgen, Pt.42',
      callePrincipal: 'Avenidad de la Virgen',
      calleSecundaria: 'Pt.42',
      numeroCasa: '18',
      paisTitulo: 'Ecuador',
      ciudadTitulo: 'Quito',
      colegioTitulo: 'Consejo Provinicial de Pichincha',
      nombreTitulo: 'Bachillerato Técnico en Contabilidad',
      meritoAcademico: '',
      meritoDeportivo: 'Atleta de alto rendimiento',
      pinSeguridad: 675432,
      estado: 'ACTIVO',
      fechaInscripcion:'2023/16/04'
  },
  {
    codigo: 3,
      cedula: 1556789342,
      apellidos: 'Andrade Jácome',
      nombres: 'Nicole Mikaela',
      email: 'alf.mar@gmail.com',
      sexo: 'FEMENINO',
      fechaNacimiento: '1998/05/18',
      telCelular: '0911324563',
      telConvencional: '21526374',
      nacionalidad: 'Nacido Ecuador ',
      provinciaNacimiento: 'Guayas',
      cantonNacimiento: 'Guayaquil',
      provinciaResidencia:  'Pichincha',
      cantonResidencia: 'Quito',
      direccionActual: 'Quitumbe, Condor Ñam, Pasaje 12',
      callePrincipal: 'Condor Ñam',
      calleSecundaria: 'Pasaje 12',
      numeroCasa: '43',
      paisTitulo: 'Colombia',
      ciudadTitulo: 'Bogota',
      colegioTitulo: 'Colegio Calasanz',
      nombreTitulo: 'Bachillerato Técnico en Contabilidad',
      meritoAcademico: '',
      meritoDeportivo: '',
      pinSeguridad: 257612,
      estado: 'ACTIVO',
      fechaInscripcion:'2023/17/04'
  },
  {
    codigo: 4,
      cedula: 1945367238,
      apellidos: 'Arreaga Caicedo',
      nombres: 'Daniel Steven',
      email: 'dsteven@gmail.com',
      sexo: 'MASCULINO',
      fechaNacimiento: '2003/08/08',
      telCelular: '0975345263',
      telConvencional: '23615243',
      nacionalidad: 'Nacido Ecuador',
      provinciaNacimiento: 'Azuay',
      cantonNacimiento: 'Cuenca',
      provinciaResidencia:  'Pichincha',
      cantonResidencia: 'Quito',
      direccionActual: 'Solanda, Pasaje 0e356',
      callePrincipal: 'Solanda',
      calleSecundaria: 'Pasaje 0e356',
      numeroCasa: '24',
      paisTitulo: 'Ecuador',
      ciudadTitulo: 'Quito',
      colegioTitulo: 'Colegio Técnico Sucre',
      nombreTitulo: 'Bachillerato Técnico en Electricidad',
      meritoAcademico: 'Abanderado Pabellon Nacional',
      meritoDeportivo: '',
      pinSeguridad: 342567,
      estado: 'ACTIVO',
      fechaInscripcion:'2023/17/04'
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
    'Observaciones'
  ]
  downloadFile() {
    const fileUrl = '../../../assets/EXPEDIENTE DE EJEMPLO.pdf';
    window.open(fileUrl, '_blank');
  }
  ngOnInit(): void {
  }

}
