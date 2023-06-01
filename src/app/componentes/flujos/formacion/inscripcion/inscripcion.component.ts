import { InscripcionCompleta } from '../../../../modelo/flujos/formacion/inscripcion-completa';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { Subscription, switchMap } from 'rxjs';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';
import { Notificacion } from 'src/app/util/notificacion';
import { AlertaComponent } from '../../../util/alerta/alerta.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaArchivoService } from 'src/app/servicios/carga-archivo';
import { OPCIONES_DATEPICKER } from '../../../../util/constantes/opciones-datepicker.const';
import { MyValidators } from '../../../../util/validators';
import {
  CANTONES_POR_PROVINCIA,
  PROVINCIAS,
} from '../../../../util/constantes/provincias_cuidades';
import {
  MdbStepChangeEvent,
  MdbStepperComponent,
} from 'mdb-angular-ui-kit/stepper';
import { ComponenteBase } from 'src/app/util/componente-base';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { InscripcionService } from '../../../../servicios/formacion/inscripcion.service';
import { Provincia } from 'src/app/modelo/admin/provincia';
import { Canton } from 'src/app/modelo/admin/canton';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { InscripcionCompletaDto } from 'src/app/modelo/flujos/formacion/inscripcion-completa-dto';
import { InscripcionResultado } from 'src/app/modelo/flujos/formacion/inscripcion-resultado';
import { ValidacionUtil } from 'src/app/util/validacion-util';
import { ValidaPinInscripcionUtil } from 'src/app/modelo/flujos/formacion/valida-pin-inscripcion-util';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss'],
})
export class InscripcionComponent extends ComponenteBase implements OnInit {
  @ViewChild('stepper') stepper!: MdbStepperComponent;

  minDate = new Date(1980, 1, 31);
  maxDate = new Date(2005, 12, 31);
  provincias: Provincia[];
  translationOptions = OPCIONES_DATEPICKER;
  cantonesNacimiento: Canton[];
  cantonesResidencia: Canton[];
  formularioInscripcion: FormGroup;
  formularioPinSeguridad: FormGroup;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  inscripcion: InscripcionCompletaDto;
  showLoading: boolean;
  docInscripcion: File;
  tamMaxArchivo: number = 0;
  hayMeritoDeportivo: boolean = false;
  hayMeritoAcademico: boolean = false;
  fechaActual: Date;

  step: number = 0;
  inscripcionResultado: InscripcionResultado;
  idPostulante: string = '';
  finInscripcion = false;

  constructor(
    private cargaArchivoService: CargaArchivoService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private builder: FormBuilder,
    private inscripcionService: InscripcionService,
    private provinciaService: ProvinciaService
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.subscriptions = [];

    this.inscripcion = new InscripcionCompletaDto();
    this.formularioInscripcion = new FormGroup({});
    this.construirFormularios();
    this.cantonesNacimiento = [];
    this.cantonesResidencia = [];
    this.provincias = [];
    this.fechaActual = new Date();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.cargaArchivoService.maxArchivo().subscribe({
        next: (result) => {
          this.tamMaxArchivo = result;
        },
        error: (errorResponse) => {
          console.log(errorResponse);
        },
      })
    );

    this.provinciaService.getProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private construirFormularios() {
    this.formularioInscripcion = this.builder.group(
      {
        // Datos iniciales
        cedula: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            MyValidators.onlyNumbers(),
            MyValidators.validIdentification(),
          ],
        ],
        nombres: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            MyValidators.onlyLetters(),
          ],
        ],
        apellidos: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            MyValidators.onlyLetters(),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        sexo: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required, MyValidators.validAge()]],
        telCelular: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            MyValidators.onlyNumbers(),
          ],
        ],
        telConvencional: [
          '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
            MyValidators.onlyNumbers(),
          ],
        ],
        // Datos nacionalidad
        nacionalidad: ['', [Validators.required]],
        provinciaNacimiento: ['', [Validators.required]],
        cantonNacimiento: ['', [Validators.required]],
        // Datos residencia
        provinciaResidencia: ['', [Validators.required]],
        cantonResidencia: ['', [Validators.required]],
        callePrincipal: ['', [Validators.required]],
        calleSecundaria: ['', [Validators.required]],
        numeroCasa: ['', [Validators.required]],
        // Datos titulo
        paisTitulo: ['', [Validators.required]],
        ciudadTitulo: ['', [Validators.required]],
        colegioTitulo: ['', [Validators.required]],
        nombreTitulo: ['', [Validators.required]],
        // Datos merito
        meritoAcademico: ['', [Validators.minLength(10)]],
        meritoDeportivo: ['', [Validators.minLength(10)]],
        // Documentos de soporte
        docSoporte: ['', [Validators.required]],
      },
      {
        updateOn: 'change',
      }
    );
    this.formularioPinSeguridad = this.builder.group({
      pin: [
        '',
        [
          Validators.required,
          //Validators.minLength(6),
          //Validators.maxLength(6),
          //MyValidators.onlyNumbers(),
        ],
      ],
    });
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

    if (this.hayMeritoAcademico) {
      this.meritoAcademicoField.setValidators([Validators.required]);
    } else {
      this.meritoAcademicoField.clearValidators();
    }
    this.meritoAcademicoField.updateValueAndValidity();
  }

  toggleValidationsNacionalidad() {
    if (this.nacionalidadField.value === 'Extranjero') {
      this.provinciaNacimientoField.clearValidators();
      this.cantonNacimientoField.clearValidators();
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
        Notificacion.notificacionOK(
          this.notificationRef,
          this.notificationServiceLocal,
          'Archivo cargado'
        );
      }
    }
  }

  onChangeCantonNacimiento(event: any) {
    if (event === '') return;
    this.provinciaService.getCantonesPorProvincia(event).subscribe({
      next: (cantones) => {
        this.formularioInscripcion.get('cantonNacimiento')?.enable();
        this.cantonesNacimiento = cantones;
        this.cantonNacimientoField.setValue('');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onChangeCantonResidencia(event: any) {
    if (event === '') return;
    this.provinciaService.getCantonesPorProvincia(event).subscribe({
      next: (cantones) => {
        this.formularioInscripcion.get('cantonResidencia')?.enable();
        this.cantonesResidencia = cantones;
        this.cantonResidenciaField.setValidators([Validators.required]);
        this.cantonResidenciaField.setValue('');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  crearInscripcion() {
    this.inscripcion.cedula = this.cedulaField.value;
    this.inscripcion.nombre = this.nombresField.value;
    this.inscripcion.apellido = this.apellidosField.value;
    this.inscripcion.correoPersonal = this.emailField.value;
    this.inscripcion.sexo = this.sexoField.value;
    this.inscripcion.fecha_nacimiento = this.fechaNacimientoField.value;
    this.inscripcion.num_telef_celular = this.telCelularField.value;
    this.inscripcion.num_telef_convencional = this.telConvencionalField.value;
    //
    this.inscripcion.tipo_nacionalidad = this.nacionalidadField.value;
    this.inscripcion.cod_provincia_nacimiento =
      this.provinciaNacimientoField.value;
    this.inscripcion.cod_canton_nacimiento = this.cantonNacimientoField.value;
    //
    this.inscripcion.cod_provincia_residencia =
      this.provinciaResidenciaField.value;
    this.inscripcion.cod_canton_residencia = this.cantonResidenciaField.value;
    this.inscripcion.calle_principal_residencia =
      this.callePrincipalField.value;
    this.inscripcion.calle_secundaria_residencia =
      this.calleSecundariaField.value;
    this.inscripcion.numero_casa = this.numeroCasaField.value;
    //
    this.inscripcion.pais_titulo_segundonivel = this.paisTituloField.value;
    this.inscripcion.ciudad_titulo_segundonivel = this.ciudadTituloField.value;
    this.inscripcion.colegio = this.colegioTituloField.value;
    this.inscripcion.nombre_titulo_segundonivel = this.nombreTituloField.value;
    //
    this.inscripcion.merito_academico_descripcion =
      this.meritoAcademicoField.value;
    this.inscripcion.merito_deportivo_descripcion =
      this.meritoDeportivoField.value;

    // establece estado inicial de la inscripcion
    this.inscripcion.estado = 'ACTIVO';
  }

  public stepChange(event: any, stepper: MdbStepperComponent) {
    this.showLoading = true;
    const stepEvent = event as MdbStepChangeEvent;
    this.step = stepper.activeStepIndex;

    // paso 1 ingreso de datos personales
    if (this.step == 0) {
      this.crearInscripcion();

      // crear inscripcion
      let formData = new FormData();
      formData.append('datosPersonales', JSON.stringify(this.inscripcion));
      formData.append('documentos', this.docInscripcion);

      this.inscripcionService
        .crearInscripcion(formData)
        .pipe(
          switchMap((response: any) => {
            this.inscripcionResultado = response;

            return this.inscripcionService.generarPin(
              this.inscripcionResultado.cod_postulante
            );
          })
        )
        .subscribe({
          next: (response: any) => {
            this.showLoading = false;
            stepper.next();
          },
          error: (errorResponse: any) => {
            Notificacion.notificacion(
              this.notificationRef,
              this.notificationServiceLocal,
              errorResponse
            );
            this.showLoading = false;
            stepper.setNewActiveStep(0);
          },
        });
    }
    // paso 2 ingreso de pin
    else if (this.step == 1) {

      this.showLoading = true;

      if (ValidacionUtil.isNullOrEmpty(this.pinField.value)) {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          null,
          'Debe ingresar el pin'
        );
        this.showLoading = false;
        stepper.setNewActiveStep(1);
        return;
      } else {
        let validaPin = new ValidaPinInscripcionUtil();

        validaPin.pin = this.pinField.value;
        validaPin.idPostulante = this.inscripcionResultado.cod_postulante;
        validaPin.idDatoPersonal =
          this.inscripcionResultado.cod_datos_personales;

        this.subscriptions.push(
          this.inscripcionService.validarPin(validaPin).subscribe({
            next: (response: any) => {
              this.idPostulante = response.mensaje;
              this.showLoading = false;
              stepper.next();
              this.finInscripcion = true;
            },
            error: (errorResponse: any) => {
              Notificacion.notificacion(
                this.notificationRef,
                this.notificationServiceLocal,
                errorResponse
              );
              this.showLoading = false;
              stepper.setNewActiveStep(1);
            },
          })
        );
      }
    } else if(this.step == 2){
      stepper.setNewActiveStep(2);
    }
  }
}
