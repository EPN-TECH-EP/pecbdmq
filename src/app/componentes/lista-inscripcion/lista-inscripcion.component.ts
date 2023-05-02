import {
  ValidacionInscripcionComponent
} from '../flujos/formacion/validacion-inscripcion/validacion-inscripcion.component';
import {Component, OnInit} from '@angular/core';
import {ViewChild} from '@angular/core';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {MdbPopconfirmRef, MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {Subscription} from 'rxjs';
import {MdbNotificationRef, MdbNotificationService,} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Notificacion} from 'src/app/util/notificacion';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';
import {Inscripcion} from 'src/app/modelo/admin/inscripcion';
import {HeaderType} from 'src/app/enum/header-type.enum';
import {MdbModalRef, MdbModalService} from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-lista-inscripcion',
  templateUrl: './lista-inscripcion.component.html',
  styleUrls: ['./lista-inscripcion.component.scss']
})
export class ListaInscripcionComponent implements OnInit {
  //modal
  modalRef: MdbModalRef<ValidacionInscripcionComponent> | null = null;

  //model
  inscripcion: Inscripcion[] = [{
    codigo: 1,
    cedula: 1234567891,
    apellidos: 'Campos Torres',
    nombres: 'Lucas Alfonso',
    email: 'l.alfonso@gmail.com',
    sexo: 'MASCULINO',
    fechaNacimiento: '2004/06/03',
    telCelular: '0939745261',
    telConvencional: '3112929',
    nacionalidad: 'Nacido',
    provinciaNacimiento: 'Pichincha',
    cantonNacimiento: 'Quito',
    provinciaResidencia: 'Pichincha',
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
    estado: 'ACTIVO',
    fechaInscripcion: '2023/14/04'
  }

  ];

  inscripciones: Inscripcion[] = [
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
      provinciaResidencia: 'Pichincha',
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

      estado: 'ACTIVO',
      fechaInscripcion: '2023/15/04'
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
      provinciaResidencia: 'Guayas',
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

      estado: 'ACTIVO',
      fechaInscripcion: '2023/16/04'
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
      provinciaResidencia: 'Pichincha',
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

      estado: 'ACTIVO',
      fechaInscripcion: '2023/17/04'
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
      provinciaResidencia: 'Pichincha',
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

      estado: 'ACTIVO',
      fechaInscripcion: '2023/17/04'
    },
  ];

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[];
  public showLoading: boolean;

  //options
  options = [
    {value: 'ACTIVO', label: 'ACTIVO'},
    {value: 'INACTIVO', label: 'INACTIVO'},
  ];

  //table
  @ViewChild('table') table!: MdbTableDirective<Inscripcion>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Cédula', 'Apellidos', 'Nombres', 'Sexo', 'Fecha Inscripción'];

  constructor(private notificationService: MdbNotificationService,
              private modalService: MdbModalService) {


  }


  ngOnInit(): void {

  }

  private notificacion(errorResponse: HttpErrorResponse) {

    let customError: CustomHttpResponse = errorResponse.error;
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;

    let mensajeError = customError.mensaje;
    let codigoError = errorResponse.status;

    if (!mensajeError) {
      mensajeError = 'Error inesperado';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }


    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }

//Funcion para abrir modal
  // openModal() {
  //   this.modalRef = this.modalService.open(ValidacionInscripcionComponent, {
  //     modalClass: 'modal-xl',
  //     data: {inscripciones:this.inscripciones}
  //   })
  // }
  openModal(mode: 'add' | 'edit', data?: Inscripcion): void {
    this.modalRef = this.modalService.open(ValidacionInscripcionComponent, {
      modalClass: 'modal-xl',
      data: {
        codigo: data ? data.codigo : '',
        cedula: data ? data.cedula : '',
        apellidos: data ? data.apellidos : '',
        nombres: data ? data.nombres : '',
        email: data ? data.email : '',
        sexo: data ? data.sexo : '',
        fechaNacimiento: data ? data.fechaNacimiento : '',
        telCelular: data ? data.telCelular : '',
        telConvencional: data ? data.telConvencional : '',
        nacionalidad: data ? data.nacionalidad : '',
        provinciaNacimiento: data ? data.provinciaNacimiento : '',
        cantonNacimiento: data ? data.cantonNacimiento : '',
        provinciaResidencia: data ? data.provinciaResidencia : '',
        cantonResidencia: data ? data.cantonResidencia : '',
        direccionActual: data ? data.direccionActual : '',
        callePrincipal: data ? data.callePrincipal : '',
        calleSecundaria: data ? data.calleSecundaria : '',
        numeroCasa: data ? data.numeroCasa : '',
        paisTitulo: data ? data.paisTitulo : '',
        ciudadTitulo: data ? data.ciudadTitulo : '',
        colegioTitulo: data ? data.colegioTitulo : '',
        nombreTitulo: data ? data.nombreTitulo : '',
        meritoAcademico: data ? data.meritoAcademico : '',
        meritoDeportivo: data ? data.meritoDeportivo : '',
        estado: data ? data.estado : '',
        fechaInscripcion: data ? data.fechaInscripcion : '',

      },
      ignoreBackdropClick: true,
    });
    this.modalRef.onClose.subscribe((modalData: Inscripcion) => {
      if (!modalData) {
        return;
      }
      if (mode === 'add') {
        this.inscripciones = [...this.inscripciones, {...modalData}];
      } else if (mode === 'edit' && data) {
        const index = this.inscripciones.indexOf(data);
        this.inscripciones[index] = modalData;
        this.inscripciones = [...this.inscripciones];
      }
    });
  }

  public notificacionOk(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }


}
