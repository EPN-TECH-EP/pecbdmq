import {Component, OnInit} from '@angular/core';
import {OPCIONES_DATEPICKER} from '../../../../util/constantes/opciones-datepicker.const';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {InscripcionCompletaDto} from '../../../../modelo/flujos/formacion/inscripcion-completa-dto';
import {InscripcionResultado} from '../../../../modelo/flujos/formacion/inscripcion-resultado';
import {CargaArchivoService} from '../../../../servicios/carga-archivo';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ProvinciaService} from '../../../../servicios/provincia.service';
import {CiudadanoService} from '../../../../servicios/api-bomberos/ciudadano.service';
import {FormacionService} from '../../../../servicios/formacion/formacion.service';
import {Notificacion} from '../../../../util/notificacion';
import {ComponenteBase} from '../../../../util/componente-base';
import {AutenticacionService} from '../../../../servicios/autenticacion.service';
import {Usuario} from '../../../../modelo/admin/usuario';
import {defaultTo} from 'lodash';
import {ProInscripcionService} from '../../../../servicios/profesionalizacion/pro-inscripcion.service';
import {ProConvocatoriaService} from '../../../../servicios/profesionalizacion/pro-convocatoria.service';
import {ProConvocatoria} from '../../../../modelo/admin/pro-convocatoria';
import {EstudianteService} from '../../../../servicios/formacion/estudiante.service';
import {HttpErrorResponse} from '@angular/common/http';
import {
  ProRequisitoConvocatoriaService
} from '../../../../servicios/profesionalizacion/pro-requisito-convocatoria.service';
import {
  ProRequisitoConvocatoriaDto
} from "../../../../modelo/flujos/profesionalizacion/pro-requisito-convocatoria.models";
import {ProInscripcionCreateUpdateDto} from "../../../../modelo/flujos/profesionalizacion/pro-inscripcion.models";
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-pro-inscripcion',
  templateUrl: './pro-inscripcion.component.html',
  styleUrls: ['./pro-inscripcion.component.scss'],
  providers: [DatePipe]
})
export class ProInscripcionComponent extends ComponenteBase implements OnInit {
  public userData: Usuario;
  minDate = new Date(1950, 1, 31);
  maxDate = new Date(2010, 12, 31);
  translationOptions = OPCIONES_DATEPICKER;
  formularioInscripcion: FormGroup;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  inscripcion: InscripcionCompletaDto;
  showLoading: boolean;
  docInscripcion: File;
  tamMaxArchivo = 0;
  fechaActual: Date;
  inscripcionResultado: InscripcionResultado;
  showLoadingFull = false;
  existenDatosCiudadano = false;
  cedulaValida = false;
  showServicioNoDisponible = false;
  private currentConvocatoria: ProConvocatoria;
  public requisitos: ProRequisitoConvocatoriaDto[];

  constructor(
    private cargaArchivoService: CargaArchivoService,
    private proConvocatoriaService: ProConvocatoriaService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private builder: FormBuilder,
    private inscripcionService: ProInscripcionService,
    private provinciaService: ProvinciaService,
    private ciudadanoService: CiudadanoService,
    private proRequisitoConvocatoriaService: ProRequisitoConvocatoriaService,
    private formacionService: FormacionService,
    private autenticacionService: AutenticacionService,
    private estudianteService: EstudianteService,
    private datePipe: DatePipe,
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.userData = this.autenticacionService.obtieneUsuarioDeCache()
    this.subscriptions = [];
    this.inscripcion = new InscripcionCompletaDto();
    this.formularioInscripcion = new FormGroup({});
    this.construirFormularios();
    this.fechaActual = new Date();
  }

  ngOnInit(): void {
    this.setEnabledDisabledControls(false);
    this.cargarCatalogos();
    this.getConvocatoria();
    this.getEstudiante();
    this.consultarDatosCedula();
  }

  private cargarCatalogos() {
    this.subscriptions.push(
      this.cargaArchivoService.maxArchivo().subscribe({
        next: (result) => {
          this.tamMaxArchivo = result;
        },
        error: () => {
          this.showServicioNoDisponible = true;
        },
      })
    );
  }

  private construirFormularios() {
    this.formularioInscripcion = this.builder.group(
      {
        cedula: [defaultTo(this.userData.codDatosPersonales.cedula, '')],
        nombres: [''],
        apellidos: [''],
        email: [defaultTo(this.userData.codDatosPersonales.correoPersonal, '')],
        fechaNacimiento: [null],
        docSoporte: ['', [Validators.required]],
      },
      {
        updateOn: 'change',
      }
    );
  }

  private setEnabledDisabledControls(enabled: boolean) {
    if (enabled) {
      this.formularioInscripcion.controls.docSoporte.enable();
      this.formularioInscripcion.controls.nombres.enable();
      this.formularioInscripcion.controls.apellidos.enable();
      this.formularioInscripcion.controls.fechaNacimiento.enable();
    } else {
      // this.formularioInscripcion.controls.nombres.disable();
      // this.formularioInscripcion.controls.cedula.disable();
      // this.formularioInscripcion.controls.apellidos.disable();
      // this.formularioInscripcion.controls.email.disable();
      // this.formularioInscripcion.controls.fechaNacimiento.disable();
    }
  }

  get cedulaField() {
    return this.formularioInscripcion.get('cedula');
  }

  get nombresField() {
    return this.formularioInscripcion.get('nombres');
  }

  get apellidosField() {
    return this.formularioInscripcion.get('apellidos');
  }

  get emailField() {
    return this.formularioInscripcion.get('email');
  }

  get fechaNacimientoField() {
    return this.formularioInscripcion.get('fechaNacimiento');
  }

  get colegioTituloField() {
    return this.formularioInscripcion.get('colegioTitulo');
  }

  get nombreTituloField() {
    return this.formularioInscripcion.get('nombreTitulo');
  }

  get docSoporteField() {
    return this.formularioInscripcion.get('docSoporte');
  }

  subirArchivo(event: any): void {
    let doc: File;
    let docName: string;
    // Para validar tamaño y extension pdf
    const extension = '.pdf';
    docName = event.target.files[0].name;
    doc = event.target.files[0];
    if (doc !== undefined) {
      if (doc.size > this.tamMaxArchivo) {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          null,
          'Archivo excede el tamaño máximo permitido'
        );
      } else if (!docName.endsWith(extension)) {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          null,
          'El archivo debe ser de tipo .pdf'
        );
      } else {
        this.docInscripcion = doc;
        Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Archivo cargado');
      }
    }
  }

  crearInscripcion() {
    /*let file;
    if (this.docInscripcion) {
      const reader = new FileReader();
      reader.onload = () => {
        file = reader.result;
      };
    }*/
    const formData1: ProInscripcionCreateUpdateDto = {
      aceptado: false,
      adjunto: '',
      codEstudiante: this.userData.codEstudiante,
      codConvocatoria: this.currentConvocatoria.codigo,
      fechaInscripcion: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      codInscripcion: 0,
      email: this.formularioInscripcion.get('email').value
    }
    let formData = new FormData();
    formData.append('datosInscripcion', JSON.stringify(formData1));
    formData.append('docsInscripcion', this.docInscripcion);

    this.inscripcionService.crearInscripcionConDocumentos(formData).subscribe({
      next: (resp: any) => {
        this.inscripcionResultado = resp;
        this.inscripcion.codDatoPersonal = this.inscripcionResultado.codDatosPersonales;
        Notificacion.notificacionOK(
          this.notificationRef,
          this.notificationServiceLocal,
          'Inscripción realizada con éxito'
        );
      },
      error: (errorResponse: HttpErrorResponse) => {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          errorResponse
        );
      }
    })
  }

  public onSubmit(event: any) {
    this.inscripcion.cedula = this.cedulaField.value;
    this.inscripcion.nombre = this.nombresField.value;
    this.inscripcion.apellido = this.apellidosField.value;
    this.inscripcion.correoPersonal = this.emailField.value;
    this.inscripcion.fechaNacimiento = this.fechaNacimientoField.value;
    this.inscripcion.estado = 'ACTIVO';

    this.mensajeConfirmacion = '¿Deseas inscribirte a profesionalización?';
    super.openPopconfirm(event, this.crearInscripcion.bind(this));
  }

  consultarDatosCedula() {
    this.showLoadingFull = false;
    this.setEnabledDisabledControls(false);
    this.consultaDatosCiudadano();
  }

  private consultaDatosCiudadano() {
    // si no existe inscripción, se consultan los datos del ciudadano
    // let ciudadano: Ciudadano;

    // consulta datos ciudadano
    // this.subscriptions.push(
    //   this.ciudadanoService.getByCedula(this.cedulaField.value).subscribe({
    //     next: (response: any) => {
    //       ciudadano = response[0];
    //       this.existenDatosCiudadano = true;
    //       this.cedulaValida = true;
    //
    //       // establece valor con los datos del ciudadano
    //       const [day, month, year] = ciudadano.fechaNacimiento.split('/');
    //       const fecha = new Date(+year, +month - 1, +day);
    //       this.fechaNacimientoField.setValue(fecha);
    //
    //       const partesNombre: string[] = ciudadano.nombre.split(' ');
    //       const apellidos = partesNombre[0] + ' ' + partesNombre[1];
    //       const nombres = partesNombre[2] + ' ' + partesNombre[3];
    //       this.nombresField.setValue(nombres);
    //       this.apellidosField.setValue(apellidos);
    //     },
    //     error: () => {
    //       this.existenDatosCiudadano = false;
    //       this.setEnabledDisabledControls(true);
    //       Notificacion.notificacion(
    //         this.notificationRef,
    //         this.notificationServiceLocal,
    //         null,
    //         'Error al consultar la cédula ingresada - Si el error persiste, contacte al administrador'
    //       );
    //       this.showLoadingFull = false;
    //       return;
    //     },
    //   })
    // );
  }

  private getConvocatoria() {
    this.proConvocatoriaService.listarActiva().subscribe({
      next: (resp) => {
        const data = resp.filter(item => item.estado === 'INSCRIPCION')
        if (data.length > 0) {
          this.currentConvocatoria = data[0];
          this.proRequisitoConvocatoriaService.getByCodConvocatoria(this.currentConvocatoria.codigo).subscribe(reqConv => {
            this.requisitos = reqConv;
          })
        } else
          this.showServicioNoDisponible = true;
      },
      error: () => {
        this.showServicioNoDisponible = true;
      }
    })
  }

  private getEstudiante() {
    this.estudianteService.getEstudianteByUser(this.userData.codUsuario).subscribe({
      next: (resp) => {
        this.userData.codEstudiante = resp.codEstudiante;
      },
      error: () => {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          null,
          'Error al cargar los datos del estudiante, no podrá realizar la inscripción'
        );
      }
    })
  }
}
