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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CargaArchivoService} from 'src/app/servicios/carga-archivo';
import {OPCIONES_DATEPICKER} from "../../../../util/constantes/opciones-datepicker.const";
import {MyValidators} from "../../../../util/validators";
import {CANTONES_POR_PROVINCIA, PROVINCIAS} from "../../../../util/constantes/provincias_cuidades";

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss'],
})
export class InscripcionComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  minDate = new Date(1980, 1, 31);
  maxDate = new Date(2005, 12, 31);
  provincias = PROVINCIAS;
  translationOptions = OPCIONES_DATEPICKER;
  cantonesNacimiento     : string[];
  cantonesResidencia     : string[];
  formularioInscripcion  : FormGroup;
  formularioPinSeguridad : FormGroup;
  notificationRef        : MdbNotificationRef<AlertaComponent> | null = null;
  inscripcion            : Inscripcion;
  showLoading            : boolean;
  docInscripcion         : File;
  tamMaxArchivo          : number = 0;
  hayMeritoDeportivo     : boolean = false;
  hayMeritoAcademico     : boolean = false;
  fechaActual            : Date;

  constructor(
    private cargaArchivoService: CargaArchivoService,
    private notificationService: MdbNotificationService,
    private builder: FormBuilder,
  ) {
    this.inscripcion = new Inscripcion();
    this.formularioInscripcion = new FormGroup({})
    this.construirFormularios();
    this.cantonesNacimiento = [];
    this.cantonesResidencia = [];
    this.fechaActual = new Date();
  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.cargaArchivoService.maxArchivo().subscribe({
        next: (result) => {this.tamMaxArchivo = result},
        error: (errorResponse) => {console.log(errorResponse)},
      }));
  }

  private construirFormularios() {
    this.formularioInscripcion = this.builder.group({
      // Datos iniciales
      cedula              : ["", [Validators.required,
                                  Validators.minLength(10),
                                  Validators.maxLength(10),
                                  MyValidators.onlyNumbers(),
                                  MyValidators.validIdentification()]
                            ],
      nombres             : ["", [Validators.required,
                                  Validators.minLength(3),
                                  Validators.maxLength(50),
                                  MyValidators.onlyLetters()]
                            ],
      apellidos           : ["", [Validators.required,
                                  Validators.minLength(3),
                                  Validators.maxLength(50),
                                  MyValidators.onlyLetters()]
                            ],
      email               : ["", [Validators.required, Validators.email]],
      sexo                : ["", [Validators.required]],
      fechaNacimiento     : ["", [Validators.required]],
      telCelular          : ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10), MyValidators.onlyNumbers()]],
      telConvencional     : ["", [Validators.required, Validators.minLength(9), Validators.maxLength(9), MyValidators.onlyNumbers()]],
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
      meritoAcademico     : ["", [Validators.minLength(10)]],
      meritoDeportivo     : ["", [Validators.minLength(10)]],
      // Documentos de soporte
      docSoporte          : ["", [Validators.required]],
    }, {
      updateOn: 'change'
    });
    this.formularioPinSeguridad = this.builder.group({
      pin: ["267389", [Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
                MyValidators.onlyNumbers()]
      ]
    })
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

  get pinField() {
    return this.formularioPinSeguridad.get('pin');
  }

  onMeritoDeportivoChange(event: any) {
    this.hayMeritoDeportivo = event.target.checked;

    if (this.hayMeritoDeportivo) {
      this.meritoDeportivoField.setValidators([Validators.required]);
    } else {
      this.meritoDeportivoField.clearValidators();
    }
    this.meritoDeportivoField.updateValueAndValidity();
  }

  onMeritoAcademicoChange(event: any) {
    this.hayMeritoAcademico = event.target.checked;

    if(this.hayMeritoAcademico) {
      this.meritoAcademicoField.setValidators([Validators.required]);
    } else {
      this.meritoAcademicoField.clearValidators();
    }
    this.meritoAcademicoField.updateValueAndValidity();
}

  toggleValidationsNacionalidad() {
    if( this.nacionalidadField.value === 'Extranjero' ) {
      this.provinciaNacimientoField.clearValidators()
      this.cantonNacimientoField.clearValidators()
      this.provinciaNacimientoField.setValue('');
      this.cantonNacimientoField.setValue('');
    } else {
      this.provinciaNacimientoField.setValidators([Validators.required]);
      this.cantonNacimientoField.setValidators([Validators.required]);
    }
  }

  subirArchivo(event: any): void {
    let doc: File;
    let docName: string;
    //Para validar tamaño y extension pdf
    const extension = '.pdf';
    docName = event.target.files[0].name;
    doc = event.target.files[0];
    if (doc !== undefined) {
      if (doc.size > this.tamMaxArchivo) {
        this.notificacion(null, 'Archivo excede el tamaño máximo permitido')
      } else if (!docName.endsWith(extension)) {
        this.notificacion(null, 'El archivo debe ser de tipo .pdf');
      } else {
        this.docInscripcion = doc;
        this.notificacionOK('Archivo cargado');

      }
    }
  }

  changeCantonNacimiento(event: any) {
    const provincia = this.provincias.find(provincia=> provincia.id === event);
    this.cantonesNacimiento = CANTONES_POR_PROVINCIA[provincia.nombre];
    this.cantonNacimientoField.setValue('');
  }

  changeCantonResidencia(event: any) {
    const provincia = this.provincias.find(provincia=> provincia.id === event);
    this.cantonesResidencia = CANTONES_POR_PROVINCIA[provincia.nombre];
    this.cantonResidenciaField.setValue('');
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
