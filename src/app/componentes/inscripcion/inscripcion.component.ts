import { Provincia } from './../../modelo/provincia';
import { Inscripcion } from './../../modelo/inscripcion';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { Subscription } from 'rxjs';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { UsuarioFrm } from 'src/app/modelo/util/usuario-frm';
import { Notificacion } from 'src/app/util/notificacion';
import { Usuario } from '../../modelo/usuario';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { AbstractControl, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CargaArchivoService } from 'src/app/servicios/carga-archivo';
import { FileUploadStatus } from 'src/app/modelo/util/file-upload-status';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { MdbStepChangeEvent } from 'mdb-angular-ui-kit/stepper';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss'],
})
export class InscripcionComponent implements OnInit, OnDestroy {
  minDate = new Date(1994, 11, 31);
  maxDate = new Date(2005, 12, 1);
  translationOptions = {
    title: 'Seleccionar Fecha',
    monthsFull: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    monthsShort: [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ],

    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    weekdaysNarrow: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    okBtnText: 'Ok',
    clearBtnText: 'Listo',
    cancelBtnText: 'Cancelar',
  };
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  formularioInscripcion: FormGroup;
  inscripcion: Inscripcion;
  inscripciones: Inscripcion[];
  documentosInscripcion: File[];
  provincias:Provincia[];
  provincia:Provincia;
  opcionSeleccionadaMeritoDeportivo: boolean = false;
  opcionSeleccionadaMeritoAcademico: boolean= false;

  public radioNacidoEcuador = document.getElementById("radioNacidoEcuador");
  public radioExtranjero = document.getElementById("radioExtranjero");
  public radioComunidadFrontera = document.getElementById("radioComunidadFrontera");
  public showLoading: boolean;
  public fileStatus = new FileUploadStatus();
  public fileName: string;
  public docInscripcion: File;
  private maxArchivo: number = 0;

  constructor(

    public usuarioEnvio: Usuario,
    public usuarioFrm: UsuarioFrm,
    private cargaArchivoService: CargaArchivoService,
    private notificationService: MdbNotificationService,
    private ApiProvincia: ProvinciaService
  ) {

    this.inscripcion ={
      codigo: '' as any,
      cedula: '' as any,
      apellidos: '',
      nombres: '',
      email: '',
      sexo: '',
      fechaNacimiento: '' as any,
      telCelular: '',
      telConvencional: '',
      nacionalidad: '',
      provinciaNacimiento: '',
      cantonNacimiento: '',
      provinciaResidencia: '',
      cantonResidencia: '',
      direccionActual: '',
      callePrincipal: '',
      calleSecundaria: '',
      numeroCasa: '',
      paisTitulo: '',
      ciudadTitulo: '',
      colegioTitulo: '',
      nombreTitulo: '',
      meritoAcademico: '',
      meritoDeportivo: '',
      estado: 'ACTIVO',
      fechaInscripcion:''
  },
    this.formularioInscripcion = new FormGroup({
      frmCedula: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmApellidos: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmNombres: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmEmail: new FormControl(null, { validators: Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), updateOn: 'blur' }),
      frmSexo: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmFechaNacimiento: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmTelefonoCelular: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmTelefonoConvencional: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),

      frmProvinciaNacimiento: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmCantonNacimiento: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmProvinciaResidencia: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmCantonResidencia: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmCallePrincipal: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmCalleSecundaria: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmNumeroCasa: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmTituloPais: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmTituloCiudad: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmTituloColegio: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmTituloNombre: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmMeritoDeportivo: new FormControl(null, { updateOn: 'blur' }),
      frmMeritoAcademico: new FormControl(null, { updateOn: 'blur' }),
      frmArchivo: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      frmFechaInscripcion: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    });}

    get frmCedula(): AbstractControl {
      return this.formularioInscripcion.get('frmCedula')!;
    }
    get frmApellidos(): AbstractControl {
      return this.formularioInscripcion.get('frmApellidos')!;
    }
    get frmNombres(): AbstractControl {
      return this.formularioInscripcion.get('frmNombres')!;
    }
    get frmEmail(): AbstractControl {
      return this.formularioInscripcion.get('frmEmail')!;
    }
    get frmSexo(): AbstractControl {
      return this.formularioInscripcion.get('frmSexo')!;
    }
    get frmFechaNacimiento(): AbstractControl {
      return this.formularioInscripcion.get('frmFechaNacimiento')!;
    }
    get frmTelefonoCelular(): AbstractControl {
      return this.formularioInscripcion.get('frmTelefonoCelular')!;
    }
    get frmTelefonoConvencional(): AbstractControl {
      return this.formularioInscripcion.get('frmTelefonoConvencional')!;
    }
    get frmNacionalidad(): AbstractControl {
      return this.formularioInscripcion.get('frmCantonNacimiento')!;
    }
    get frmProvinciaNacimiento(): AbstractControl {
      return this.formularioInscripcion.get('frmProvinciaNacimiento')!;
    }
    get frmCantonNacimiento(): AbstractControl {
      return this.formularioInscripcion.get('frmCantonNacimiento')!;
    }
    get frmProvinciaResidencia(): AbstractControl {
      return this.formularioInscripcion.get('frmProvinciaResidencia')!;
    }
    get frmCantonResidencia(): AbstractControl {
      return this.formularioInscripcion.get('frmCantonResidencia')!;
    }
    get frmDireccion(): AbstractControl {
      return this.formularioInscripcion.get('frmDireccion')!;
    }
    get frmCallePrincipal(): AbstractControl {
      return this.formularioInscripcion.get('frmCallePrincipal')!;
    }
    get frmCalleSecundaria(): AbstractControl {
      return this.formularioInscripcion.get('frmCalleSecundaria')!;
    }
    get frmNumeroCasa(): AbstractControl {
      return this.formularioInscripcion.get('frmNumeroCasa')!;
    }
    get frmTituloPais(): AbstractControl {
      return this.formularioInscripcion.get('frmTituloPais')!;
    }
    get frmTituloCiudad(): AbstractControl {
      return this.formularioInscripcion.get('frmTituloCiudad')!;
    }
    get frmTituloColegio(): AbstractControl {
      return this.formularioInscripcion.get('frmTituloColegio')!;
    }
    get frmTituloNombre(): AbstractControl {
      return this.formularioInscripcion.get('frmTituloNombre')!;
    }
    get frmMerito(): AbstractControl {
      return this.formularioInscripcion.get('frmMerito')!;
    }
    get frmMeritoDeportivo(): AbstractControl {
      return this.formularioInscripcion.get('frmMeritoDeportivo')!;
    }
    get frmMeritoAcademico(): AbstractControl {
      return this.formularioInscripcion.get('frmMeritoAcademico')!;
    }
    get frmFechaInscripcion(): AbstractControl {
      return this.formularioInscripcion.get('frmFechaInscripcion')!;
    }


  ngOnInit(): void {
    this.ApiProvincia.getProvincias().subscribe((data) => {
      this.provincias = data;
    });

    this.subscriptions.push(
      this.cargaArchivoService.maxArchivo().subscribe({
        next: (result) => {
          this.maxArchivo = result;
        },
        error: (errorResponse) => {
          console.log(errorResponse);
        },
      })
    );




  }

  myGroup = new FormGroup({
    frmProvinciaNacimiento: new FormControl()
});





public subirArchivo(event: any): void {
  let doc: File;
  let docName: string;
  //Para validar tamaño y extension pdf
  const extension = '.pdf';
  docName = event.target.files[0].name;
  doc = event.target.files[0];
  if (doc !== undefined) {
    if (doc.size > this.maxArchivo) {
      this.notificacion(null, 'Archivo excede el tamaño máximo permitido')
    } else if (!docName.endsWith(extension)) {
      this.notificacion(null, 'El archivo debe ser de tipo .pdf');
    }  else {
      this.docInscripcion=doc;
      this.notificacionOK('Archivo cargado');

    }
  }
}

onSubmit(): void {
  this.formularioInscripcion.markAllAsTouched();
}
stepChange(event: MdbStepChangeEvent, form:NgForm){
  const paso= event.activeStepIndex;
    if (paso === 0 && !form.valid)
    {
         this.notificacion(null,'Debe Ingresar todos los valores');
    } console.log(form);

    }

  inscripcionSubmit(inscripcion: Inscripcion , isValid: boolean) {
    this.showLoading = true;

    if (isValid) {


    } else {
      console.error('Formulario inválido!!!');
    }
  }

  notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  private notificacion(errorResponse?: HttpErrorResponse, mensaje?: string) {


    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;
    let mensajeError = 'ERROR';
    let codigoError = 0;

    if (errorResponse) {
      let customError: CustomHttpResponse = errorResponse.error;
      mensajeError = customError.mensaje;
      codigoError = errorResponse.status;
    }

    if (mensaje) {
      mensajeError = mensaje;
    }


    if (!mensajeError) {
      mensajeError = 'Error inesperado: ' + codigoError;
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }


    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
