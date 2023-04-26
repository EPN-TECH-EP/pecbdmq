import {Provincia} from '../../../../modelo/admin/provincia';
import {Inscripcion} from '../../../../modelo/admin/inscripcion';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {Subscription} from 'rxjs';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';
import {Notificacion} from 'src/app/util/notificacion';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {CargaArchivoService} from 'src/app/servicios/carga-archivo';
import {ProvinciaService} from 'src/app/servicios/provincia.service';
import {OPCIONES_DATEPICKER} from "../../../../util/constantes/opciones-datepicker.const";

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss'],
})
export class InscripcionComponent implements OnInit, OnDestroy {
  minDate = new Date(1980, 1, 31);
  maxDate = new Date(2005, 12, 31);
  formularioInscripcion: FormGroup;
  translationOptions = OPCIONES_DATEPICKER;


  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  inscripcion: Inscripcion;
  provincias: Provincia[];
  opcionSeleccionadaMeritoDeportivo: boolean = false;
  opcionSeleccionadaMeritoAcademico: boolean = false;

  public radioNacidoEcuador = document.getElementById("radioNacidoEcuador");
  public radioExtranjero = document.getElementById("radioExtranjero");
  public radioComunidadFrontera = document.getElementById("radioComunidadFrontera");
  public showLoading: boolean;
  public docInscripcion: File;
  private maxArchivo: number = 0;

  constructor(
    private cargaArchivoService: CargaArchivoService,
    private notificationService: MdbNotificationService,
    private provinciaService: ProvinciaService,
    private builder: FormBuilder,
  ) {
    this.inscripcion = new Inscripcion();

    this.formularioInscripcion = new FormGroup({})
    this.construirFormularioInscripcion();

    // this.formularioInscripcion = new FormGroup({
    //   frmCedula: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmApellidos: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmNombres: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmEmail: new FormControl(null, { validators: Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), updateOn: 'blur' }),
    //   frmSexo: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmFechaNacimiento: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmTelefonoCelular: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmTelefonoConvencional: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //
    //   frmProvinciaNacimiento: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmCantonNacimiento: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmProvinciaResidencia: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmCantonResidencia: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmCallePrincipal: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmCalleSecundaria: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmNumeroCasa: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmTituloPais: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmTituloCiudad: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmTituloColegio: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmTituloNombre: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmMeritoDeportivo: new FormControl(null, { updateOn: 'blur' }),
    //   frmMeritoAcademico: new FormControl(null, { updateOn: 'blur' }),
    //   frmArchivo: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    //   frmFechaInscripcion: new FormControl(null, { updateOn: 'blur' }),
    // });
  }

  private construirFormularioInscripcion() {
    this.formularioInscripcion = this.builder.group({
      // Datos iniciales
      cedula              : ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nombres             : ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellidos           : ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email               : ["", [Validators.required, Validators.email]],
      sexo                : ["", [Validators.required]],
      fechaNacimiento     : ["", [Validators.required]],
      telCelular          : ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      telConvencional     : ["", [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      // Datos nacionalidad
      nacionalidad        : ["", [Validators.required]],
      provinciaNacimiento : ["", [Validators.required]],
      cantonNacimiento    : ["", [Validators.required]],
      // Datos residencia
      provinciaResidencia : ["", [Validators.required]],
      cantonResidencia    : ["", [Validators.required]],
      callePrincipal      : ["", [Validators.required]],
      calleSecundaria     : ["", [Validators.required]],
      numeroCasa          : ["", [Validators.required]],
      // Datos titulo
      paisTitulo          : ["", [Validators.required]],
      ciudadTitulo        : ["", [Validators.required]],
      colegioTitulo       : ["", [Validators.required]],
      nombreTitulo        : ["", [Validators.required]],
      // Datos merito
      meritoAcademico     : ["", ],
      meritoDeportivo     : ["", ],
      // Documentos de soporte
      docSoporte          : ["", [Validators.required]],
    }, {updateOn: 'blur'})
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

  get sexoField() {
    return this.formularioInscripcion.get('sexo');
  }

  get fechaNacimientoField() {
    return this.formularioInscripcion.get('fechaNacimiento');
  }

  get telCelularField() {
    return this.formularioInscripcion.get('telCelular');
  }

  get telConvencionalField() {
    return this.formularioInscripcion.get('telConvencional');
  }

  get nacionalidadField() {
    return this.formularioInscripcion.get('nacionalidad');
  }

  get provinciaNacimientoField() {
    return this.formularioInscripcion.get('provinciaNacimiento');
  }

  get cantonNacimientoField() {
    return this.formularioInscripcion.get('cantonNacimiento');
  }

  get provinciaResidenciaField() {
    return this.formularioInscripcion.get('provinciaResidencia');
  }

  get cantonResidenciaField() {
    return this.formularioInscripcion.get('cantonResidencia');
  }

  get callePrincipalField() {
    return this.formularioInscripcion.get('callePrincipal');
  }

  get calleSecundariaField() {
    return this.formularioInscripcion.get('calleSecundaria');
  }

  get numeroCasaField() {
    return this.formularioInscripcion.get('numeroCasa');
  }

  get paisTituloField() {
    return this.formularioInscripcion.get('paisTitulo');
  }

  get ciudadTituloField() {
    return this.formularioInscripcion.get('ciudadTitulo');
  }

  get colegioTituloField() {
    return this.formularioInscripcion.get('colegioTitulo');
  }

  get nombreTituloField() {
    return this.formularioInscripcion.get('nombreTitulo');
  }

  get meritoAcademicoField() {
    return this.formularioInscripcion.get('meritoAcademico');
  }

  get meritoDeportivoField() {
    return this.formularioInscripcion.get('meritoDeportivo');
  }

  get docSoporteField() {
    return this.formularioInscripcion.get('docSoporte');
  }


  ngOnInit(): void {
    this.provinciaService.getProvincias().subscribe((data) => {
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
      } else {
        this.docInscripcion = doc;
        this.notificacionOK('Archivo cargado');

      }
    }
  }

  onSubmit(): void {
    this.formularioInscripcion.markAllAsTouched();
  }

  // stepChange(event: MdbStepChangeEvent, form: NgForm) {
  //   const paso = event.activeStepIndex;
  //   if (paso === 0 && !form.valid) {
  //     this.notificacion(null, 'Debe Ingresar todos los valores');
  //   }
  //   console.log(form);
  //
  // }

  inscripcionSubmit(inscripcion: Inscripcion, isValid: boolean) {
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
