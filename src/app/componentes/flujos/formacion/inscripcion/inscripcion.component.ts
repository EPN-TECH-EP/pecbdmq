import { Component, OnInit, ViewChild } from '@angular/core';
import { MdbNotificationRef, MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { catchError, of, switchMap } from 'rxjs';
import { Notificacion } from 'src/app/util/notificacion';
import { AlertaComponent } from '../../../util/alerta/alerta.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaArchivoService } from 'src/app/servicios/carga-archivo';
import { OPCIONES_DATEPICKER } from '../../../../util/constantes/opciones-datepicker.const';
import { MyValidators } from '../../../../util/validators';
import { MdbStepChangeEvent, MdbStepperComponent } from 'mdb-angular-ui-kit/stepper';
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
import { Ciudadano } from '../../../../modelo/flujos/formacion/api-bomberos/ciudadano';
import { DatosEducacionMedia } from '../../../../modelo/flujos/formacion/api-bomberos/datos-educacion-media';
import { DatosEducacionSuperior } from '../../../../modelo/flujos/formacion/api-bomberos/datos-educacion-superior';
import { CiudadanoService } from '../../../../servicios/api-bomberos/ciudadano.service';
import { FormacionService } from 'src/app/servicios/formacion/formacion.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FORMACION } from 'src/app/util/constantes/fomacion.const';
import { debounceTime } from 'rxjs/operators';
import { ConvocatoriaService } from "../../../../servicios/formacion/convocatoria.service";
import { Convocatoria } from "../../../../modelo/admin/convocatoria";

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss'],
})
export class InscripcionComponent extends ComponenteBase implements OnInit {
  @ViewChild('stepper') stepper!: MdbStepperComponent;

  minDate = new Date(1950, 1, 31);
  maxDate = new Date(2010, 12, 31);
  provincias: Provincia[];
  translationOptions = OPCIONES_DATEPICKER;
  cantonesNacimiento: Canton[];
  cantonesResidencia: Canton[];
  formularioInscripcion: FormGroup;
  formularioPinSeguridad: FormGroup;
  formularioReenvioPin: FormGroup;
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
  pasoActual: number = 0;

  pinIncorrecto: boolean = false;
  correoPin: string = '';
  showLoadingPin: boolean = false;
  showLoadingFull: boolean = true;

  // integración con API CBDMQ
  existenDatosCiudadano: boolean = false;
  existenDatosEducacionMedia: boolean = false;
  existenDatosEducacionSuperior: boolean = false;

  showEdadInvalida: boolean = false;
  cedulaValida: boolean = false;
  ultimaCedulaValida = '';

  // estado del proceso de formación
  esEstadoInscripcion: string = 'I';

  validaFechas: boolean = false;
  esFechaValida: boolean = false;

  // error general
  showServicioNoDisponible: boolean = false;

  convocatoria: Convocatoria;

  constructor(
    private cargaArchivoService: CargaArchivoService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private builder: FormBuilder,
    private inscripcionService: InscripcionService,
    private provinciaService: ProvinciaService,
    private ciudadanoService: CiudadanoService,
    private formacionService: FormacionService,
    private convocatoriaService: ConvocatoriaService
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
    this.convocatoria = {} as Convocatoria;
  }

  ngOnInit(): void {

    this.setEnabledDisabledControls(false);

    // obtiene estado del proceso
    this.formacionService
      .getEstadoActual()
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.showServicioNoDisponible = true;
          this.showLoadingFull = false;
          console.error(errorResponse);
          return of(null);
        })
      )
      .subscribe({
        next: (estado) => {

          this.showLoadingFull = false;

          if (!estado || estado.httpStatusCode !== 200) {
            this.showServicioNoDisponible = true;
            return;
          }

          if (estado.mensaje === FORMACION.estadoInscripcion) {
            this.esEstadoInscripcion = 'T';

            // valida fechas
            this.subscriptions.push(
              this.inscripcionService.validarFechas().subscribe({
                next: (result) => {
                  this.esFechaValida = result;
                  this.validaFechas = true;

                  if (this.esFechaValida) {
                    this.cargarCatalogos();
                  }

                },
                error: (errorResponse) => {
                  this.showServicioNoDisponible = true;
                  console.log(errorResponse);
                },
              })
            );

          } else {
            this.esEstadoInscripcion = 'F';
          }
        },
      });
  }

  private cargarCatalogos() {
    // obtiene parámetros y catálogos
    this.subscriptions.push(
      this.cargaArchivoService.maxArchivo().subscribe({
        next: (result) => {
          this.tamMaxArchivo = result;
        },
        error: (errorResponse) => {
          this.showServicioNoDisponible = true;
          console.log(errorResponse);
        },
      })
    );

    this.provinciaService.getProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias;
      },
      error: (error) => {
        this.showServicioNoDisponible = true;
        console.log(error);
      },
    });

    this.convocatoriaService.getConvocatoriaActiva().subscribe({
      next: (convocatoria) => {
        this.convocatoria = convocatoria[0];
      }
    })


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
          [Validators.required, Validators.minLength(3), Validators.maxLength(50), MyValidators.onlyLetters()]
        ],
        apellidos: [
          '',
          [Validators.required, Validators.minLength(3), Validators.maxLength(50), MyValidators.onlyLetters()],
        ],
        email: ['', [Validators.required, Validators.email]],
        sexo: ['', [Validators.required]],
        area: ['', [Validators.required]],
        fechaNacimiento: [null, [Validators.required /*, MyValidators.validAge()*/]],
        telCelular: [
          '',
          [Validators.required, Validators.minLength(10), Validators.maxLength(10), MyValidators.onlyNumbers()],
        ],
        telConvencional: [
          '',
          [Validators.required, Validators.minLength(9), Validators.maxLength(9), MyValidators.onlyNumbers()],
        ],
        // Datos nacionalidad
        nacionalidad: ['', [Validators.required]],
        provinciaNacimiento: ['', [Validators.required]],
        cantonNacimiento: ['', [Validators.required]],
        // Datos residencia
        provinciaResidencia: [0, [Validators.required]],
        cantonResidencia: [0, [Validators.required]],
        callePrincipal: ['', [Validators.required]],
        calleSecundaria: ['', [Validators.required]],
        numeroCasa: ['', [Validators.required]],
        // Datos titulo
        paisTitulo: ['', [Validators.required]],
        ciudadTitulo: ['', [Validators.required]],
        colegioTitulo: ['', [Validators.required]],
        nombreTitulo: ['', [Validators.required]],
        // Datos titulo tercer nivel
        paisTituloTercerNivel: ['',],
        ciudadTituloTercerNivel: ['',],
        institucionTituloTercerNivel: ['',],
        nombreTituloTercerNivel: ['',],
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

    this.formularioReenvioPin = this.builder.group({
      correoPin: ['', [Validators.required, Validators.email]],
    });

    this.cedulaField.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.consultarDatosCedula();
    });

  }

  private setEnabledDisabledControls(enabled: boolean) {
    if (!enabled) {
      this.formularioInscripcion.controls['nombres'].disable();
      this.formularioInscripcion.controls['apellidos'].disable();
      this.formularioInscripcion.controls['email'].disable();
      this.formularioInscripcion.controls['sexo'].disable();
      this.formularioInscripcion.controls['area'].disable();
      this.formularioInscripcion.controls['fechaNacimiento'].disable();
      this.formularioInscripcion.controls['telCelular'].disable();
      this.formularioInscripcion.controls['telConvencional'].disable();
      this.formularioInscripcion.controls['nacionalidad'].disable();
      this.formularioInscripcion.controls['provinciaNacimiento'].disable();
      this.formularioInscripcion.controls['cantonNacimiento'].disable();
      this.formularioInscripcion.controls['provinciaResidencia'].disable();
      this.formularioInscripcion.controls['cantonResidencia'].disable();
      this.formularioInscripcion.controls['callePrincipal'].disable();
      this.formularioInscripcion.controls['calleSecundaria'].disable();
      this.formularioInscripcion.controls['numeroCasa'].disable();
      this.formularioInscripcion.controls['paisTitulo'].disable();
      this.formularioInscripcion.controls['ciudadTitulo'].disable();
      this.formularioInscripcion.controls['colegioTitulo'].disable();
      this.formularioInscripcion.controls['nombreTitulo'].disable();
      this.formularioInscripcion.controls['meritoAcademico'].disable();
      this.formularioInscripcion.controls['meritoDeportivo'].disable();
      this.formularioInscripcion.controls['docSoporte'].disable();

      this.formularioInscripcion.controls['paisTituloTercerNivel'].disable();
      this.formularioInscripcion.controls['ciudadTituloTercerNivel'].disable();
      this.formularioInscripcion.controls['institucionTituloTercerNivel'].disable();
      this.formularioInscripcion.controls['nombreTituloTercerNivel'].disable();

    } else {
      this.formularioInscripcion.controls['nombres'].enable();
      this.formularioInscripcion.controls['apellidos'].enable();
      this.formularioInscripcion.controls['email'].enable();
      this.formularioInscripcion.controls['sexo'].enable();
      this.formularioInscripcion.controls['area'].enable();
      this.formularioInscripcion.controls['fechaNacimiento'].enable();
      this.formularioInscripcion.controls['telCelular'].enable();
      this.formularioInscripcion.controls['telConvencional'].enable();
      this.formularioInscripcion.controls['nacionalidad'].enable();
      this.formularioInscripcion.controls['provinciaNacimiento'].enable();
      this.formularioInscripcion.controls['cantonNacimiento'].enable();
      this.formularioInscripcion.controls['provinciaResidencia'].enable();
      this.formularioInscripcion.controls['cantonResidencia'].enable();
      this.formularioInscripcion.controls['callePrincipal'].enable();
      this.formularioInscripcion.controls['calleSecundaria'].enable();
      this.formularioInscripcion.controls['numeroCasa'].enable();
      this.formularioInscripcion.controls['paisTitulo'].enable();
      this.formularioInscripcion.controls['ciudadTitulo'].enable();
      this.formularioInscripcion.controls['colegioTitulo'].enable();
      this.formularioInscripcion.controls['nombreTitulo'].enable();
      this.formularioInscripcion.controls['meritoAcademico'].enable();
      this.formularioInscripcion.controls['meritoDeportivo'].enable();
      this.formularioInscripcion.controls['docSoporte'].enable();

      this.formularioInscripcion.controls['paisTituloTercerNivel'].enable();
      this.formularioInscripcion.controls['ciudadTituloTercerNivel'].enable();
      this.formularioInscripcion.controls['institucionTituloTercerNivel'].enable();
      this.formularioInscripcion.controls['nombreTituloTercerNivel'].enable();

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

  get sexoField() {
    return this.formularioInscripcion.get('sexo');
  }

  get areaField() {
    return this.formularioInscripcion.get('area');
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

  get nombreTituloTercerNivelField() {
    return this.formularioInscripcion.get('nombreTituloTercerNivel');
  }

  get paisTituloTercerNivelField() {
    return this.formularioInscripcion.get('paisTituloTercerNivel');
  }

  get ciudadTituloTercerNivelField() {
    return this.formularioInscripcion.get('ciudadTituloTercerNivel');
  }

  get institucionTituloTercerNivelField() {
    return this.formularioInscripcion.get('institucionTituloTercerNivel');
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

  get correoPinField() {
    return this.formularioReenvioPin.get('correoPin');
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

    this.showLoadingFull = true;

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
        Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Archivo cargado');
      }
    }
    this.showLoadingFull = false;
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
    this.inscripcion.fechaNacimiento = this.fechaNacimientoField.value;
    this.inscripcion.numTelefCelular = this.telCelularField.value;
    this.inscripcion.numTelefConvencional = this.telConvencionalField.value;
    //
    this.inscripcion.tipoNacionalidad = this.nacionalidadField.value;
    this.inscripcion.codProvinciaNacimiento = this.provinciaNacimientoField.value;
    this.inscripcion.codCantonNacimiento = this.cantonNacimientoField.value;
    //
    this.inscripcion.codProvinciaResidencia = this.provinciaResidenciaField.value;
    this.inscripcion.codCantonResidencia = this.cantonResidenciaField.value;
    this.inscripcion.callePrincipalResidencia = this.callePrincipalField.value;
    this.inscripcion.calleSecundariaResidencia = this.calleSecundariaField.value;
    this.inscripcion.numeroCasa = this.numeroCasaField.value;
    //
    this.inscripcion.paisTituloSegundoNivel = this.paisTituloField.value;
    this.inscripcion.ciudadTituloSegundoNivel = this.ciudadTituloField.value;
    this.inscripcion.colegio = this.colegioTituloField.value;
    this.inscripcion.nombreTituloSegundoNivel = this.nombreTituloField.value;
    //
    this.inscripcion.meritoAcademicoDescripcion = this.meritoAcademicoField.value;
    this.inscripcion.meritoDeportivoDescripcion = this.meritoDeportivoField.value;//
    //
    this.inscripcion.nombreTituloTercerNivel = this.nombreTituloTercerNivelField.value;
    this.inscripcion.ciudadTituloTercerNivel = this.ciudadTituloTercerNivelField.value;
    this.inscripcion.paisTituloTercerNivel = this.paisTituloTercerNivelField.value;
    this.inscripcion.institucionTituloTercerNivel = this.institucionTituloTercerNivelField.value;

    // establece estado inicial de la inscripcion
    this.inscripcion.estado = 'ACTIVO';

    console.log(JSON.stringify(this.inscripcion));
  }

  public stepChange(event: any, stepper: MdbStepperComponent, elemento: string) {
    const stepEvent = event as MdbStepChangeEvent;

    if (elemento === 'stepper') {
      stepper.setNewActiveStep(this.step);
      return;
    } else {
      this.step = stepper.activeStepIndex;
      this.showLoading = true;
      this.showLoadingFull = true;
    }

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

            this.inscripcion.codDatoPersonal = this.inscripcionResultado.codDatosPersonales;

            return this.inscripcionService.generarPin(this.inscripcionResultado.codPostulante);
          })
        )
        .subscribe({
          next: (response: any) => {
            this.showLoadingFull = false;
            this.showLoading = false;
            this.pasoActual = 1;
            stepper.next();
          },
          error: (errorResponse: any) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
            this.showLoadingFull = false;
            this.showLoading = false;
            stepper.setNewActiveStep(0);
          },
        });
    }
    // paso 2 ingreso de pin
    else if (this.step == 1) {
      this.showLoading = true;
      this.pinIncorrecto = false;

      if (ValidacionUtil.isNullOrEmpty(this.pinField.value)) {
        Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Debe ingresar el pin');
        this.showLoading = false;
        this.showLoadingFull = false;
        stepper.setNewActiveStep(1);
        return;
      } else {
        let validaPin = new ValidaPinInscripcionUtil();

        validaPin.pin = this.pinField.value;
        validaPin.idPostulante = this.inscripcionResultado.codPostulante;
        validaPin.idDatoPersonal = this.inscripcionResultado.codDatosPersonales;

        this.subscriptions.push(
          this.inscripcionService.validarPin(validaPin).subscribe({
            next: (response: any) => {
              this.idPostulante = response.mensaje;
              this.showLoading = false;
              this.showLoadingFull = false;
              this.pasoActual = 2;
              this.finInscripcion = true;
              stepper.next();
            },
            error: (errorResponse: any) => {
              Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
              this.showLoading = false;
              this.showLoadingFull = false;
              stepper.setNewActiveStep(1);

              this.pinIncorrecto = true;
              this.correoPin = this.emailField.value;

              this.correoPinField.setValue(this.inscripcion.correoPersonal);
            },
          })
        );
      }
    } else if (this.step == 2) {
      stepper.setNewActiveStep(2);
    }
  }

  // reenvío de PIN en caso de que la validación haya fallado
  enviarPin() {
    if (this.correoPin == null || this.correoPin == '') {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Debe ingresar un correo electrónico'
      );
      return;
    } else {
      this.showLoadingPin = true;

      this.inscripcion.correoPersonal = this.correoPinField.value;

      this.inscripcionService.reenvioPin(this.inscripcion).subscribe({
        next: (response: any) => {
          this.showLoadingPin = false;
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Se ha enviado el pin al correo electrónico ingresado'
          );
        },
        error: (errorResponse: any) => {


          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          this.showLoadingPin = false;
        },
      });
    }
  }

  // integración con API de CBDMQ
  // consulta de datos en base a la cédula
  consultarDatosCedula() {

    if (this.cedulaField.valid) {
      if (this.ultimaCedulaValida === this.cedulaField.value) {
        this.showLoadingFull = false;
        this.setEnabledDisabledControls(false);
        return;
      }

      this.showLoadingFull = true;

      // busca inscripción por cedula
      this.subscriptions.push(
        this.inscripcionService.buscarInscripcionPorCedula(this.cedulaField.value).subscribe({
          next: (response: any) => {
            if (response) {
              Notificacion.notificacion(
                this.notificationRef,
                this.notificationServiceLocal,
                null,
                'Ya existe una inscripción con la cédula ingresada'
              );
              this.showLoadingFull = false;
              return;
            } else {
              // consulta datos ciudadano
              this.showLoadingFull = true;
              this.consultaDatosCiudadano();
            }
          },
          error: (errorResponse: any) => {
            console.log(errorResponse);
            Notificacion.notificacion(
              this.notificationRef,
              this.notificationServiceLocal,
              null,
              'Error al consultar inscripción - contacte al administrador'
            );
            this.showLoadingFull = false;
            return;
          },
        })
      );
    }
  }

  private consultaDatosCiudadano() {
    // si no existe inscripción, se consultan los datos del ciudadano
    let ciudadano: Ciudadano;

    // consulta datos ciudadano
    this.subscriptions.push(
      this.ciudadanoService.getByCedula(this.cedulaField.value).subscribe({
        next: (response) => {
          ciudadano = response[0];

          console.log(ciudadano);

          this.existenDatosCiudadano = true;
          this.cedulaValida = true;
          this.ultimaCedulaValida = this.cedulaField.value;

          this.setEnabledDisabledControls(true);

          // establece valor con los datos del ciudadano
          const [day, month, year] = ciudadano.fechaNacimiento.split('/');
          const fecha = new Date(+year, +month - 1, +day);
          this.fechaNacimientoField.setValue(fecha);

          const partesNombre: string[] = ciudadano.nombre.split(' ');
          const apellidos = partesNombre[0] + ' ' + partesNombre[1];
          const nombres = partesNombre[2] + ' ' + partesNombre[3];
          this.nombresField.setValue(nombres);
          this.apellidosField.setValue(apellidos);
          this.nombreTituloField.setValue(ciudadano.profesion);


          this.validarEdad(ciudadano.fechaNacimiento);
        },
        error: (errorResponse: any) => {
          this.existenDatosCiudadano = false;
          console.log(errorResponse);
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            null,
            'Error al consultar la cédula ingresada - Si el error persiste, contacte al administrador'
          );
          this.showLoadingFull = false;
          return;
        },
      })
    );
  }

  validarEdad(fecha: string) {
    let datosEM: DatosEducacionMedia;
    let datosES: DatosEducacionSuperior;

    this.inscripcionService.validarEdad(fecha).subscribe({
      next: (response: any) => {
        if (response) {
          this.showEdadInvalida = false;

          // consulta datos educacion media
          this.subscriptions.push(
            this.ciudadanoService.getEducacionMedia(this.cedulaField.value).subscribe({
              next: (response: any) => {
                datosEM = response[0];
                this.existenDatosEducacionMedia = true;

                // establece valores con los datos de educación media
                this.colegioTituloField.setValue(datosEM.institucion);
              },
              error: (errorResponse: any) => {
                this.existenDatosEducacionMedia = false;
                console.log(errorResponse);
              },
            })
          );

          // consulta datos educación superior
          this.subscriptions.push(
            this.ciudadanoService.getEducacionSuperior(this.cedulaField.value).subscribe({
              next: (response: any) => {
                console.log(response);
                datosES = response;
                this.existenDatosEducacionSuperior = true;
              },
              error: (errorResponse: any) => {
                this.existenDatosEducacionSuperior = false;
                console.log(errorResponse);
              },
            })
          );
        } else {
          this.showEdadInvalida = true;
        }
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
      },
    });

    //console.log(this.showEdadInvalida);
    this.showLoadingFull = false;
  }
}
