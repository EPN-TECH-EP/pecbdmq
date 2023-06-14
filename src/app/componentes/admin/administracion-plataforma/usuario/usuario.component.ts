import { Component, OnInit } from '@angular/core';
import {OPCIONES_DATEPICKER} from "../../../../util/constantes/opciones-datepicker.const";
import {Usuario} from "../../../../modelo/admin/usuario";
import {DatoPersonal} from "../../../../modelo/admin/dato-personal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Provincia} from "../../../../modelo/admin/provincia";
import {Canton} from "../../../../modelo/admin/canton";
import {UnidadGestion} from "../../../../modelo/admin/unidad-gestion";
import {Grado} from "../../../../modelo/admin/institucionales/grado";
import {Rango} from "../../../../modelo/admin/institucionales/rango";
import {Cargo} from "../../../../modelo/admin/institucionales/cargo";
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {ProvinciaService} from "../../../../servicios/provincia.service";
import {CargoService} from "../../../../servicios/cargo.service";
import {GradoService} from "../../../../servicios/grado.service";
import {UnidadGestionService} from "../../../../servicios/unidad-gestion.service";
import TipoSangreEnum from "../../../../enum/tipo-sangre.enum";
import {MyValidators} from "../../../../util/validators";
import {UsuarioService} from "../../../../servicios/usuario.service";
import {Notificacion} from "../../../../util/notificacion";
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../../../util/alerta/alerta.component";

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  protected readonly opcionesDatepicker = OPCIONES_DATEPICKER;

  usuario                       : Usuario;
  datosPersonales               : DatoPersonal;
  formularioUsuario             : FormGroup;
  provincias                    : Provincia[];
  cantonesNacimiento            : Canton[];
  cantonesResidencia            : Canton[];
  unidadesGestion               : UnidadGestion[];
  grados                        : Grado[];
  rangos                        : Rango[];
  cargos                        : Cargo[];
  tiposSangre                   : string[];
  tieneMeritoAcademico          : boolean;
  tieneMeritoDeportivo          : boolean;
  tieneNacionalidadEcuatoriana  : boolean;
  tieneNacionalidadComunidadFrontera : boolean;
  hoy: Date = new Date();
  loading: boolean = false;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;


  constructor(
    public modalRef: MdbModalRef<UsuarioComponent>,
    private builder: FormBuilder,
    private provinciaService: ProvinciaService,
    private cargoService: CargoService,
    private gradoService: GradoService,
    private unidadGestionService: UnidadGestionService,
    private usuarioService: UsuarioService,
    private mdbNotificationService: MdbNotificationService
  ) {
    this.provincias = [];
    this.cantonesNacimiento = [];
    this.cantonesResidencia = [];
    this.unidadesGestion = [];
    this.grados = [];
    this.rangos = [];
    this.cargos = [];
    this.tieneMeritoAcademico = false;
    this.tieneMeritoDeportivo = false;
    this.tieneNacionalidadEcuatoriana = false;
    this.tieneNacionalidadComunidadFrontera = false;
    this.formularioUsuario = new FormGroup({});
    this.usuario = new Usuario();
    this.datosPersonales = {} as DatoPersonal;
    this.tiposSangre = Object.values(TipoSangreEnum)
  }

  ngOnInit(): void {
    this.provinciaService.getProvincias().subscribe({
      next: (provincias) => {this.provincias = provincias},
      error: (error) => {console.error(error)}
    });
    this.gradoService.getGrados().subscribe({
      next: (grados) => {this.grados = grados},
      error: (error) => {console.error(error)}
    });
    this.cargoService.getCargos().subscribe({
      next: (cargos) => {this.cargos = cargos},
      error: (error) => {console.error(error)}
    });
    this.unidadGestionService.getUnidadGestion().subscribe({
      next: (unidadesGestion) => {this.unidadesGestion = unidadesGestion},
      error: (error) => {console.error(error)}
    })

    this.construirFormulario();
  }

  private construirFormulario() {
    this.formularioUsuario = this.builder.group({

      nombreUsuario:              ['', [Validators.required, Validators.minLength(10),
                                        Validators.maxLength(10), MyValidators.onlyNumbers,
                                        MyValidators.validIdentification()]],
      nombre:                     ['', [Validators.required, Validators.minLength(3), MyValidators.onlyLetters()]],
      apellido:                   ['', [Validators.required, Validators.minLength(3), MyValidators.onlyLetters()]],
      correoPersonal:             ['', [Validators.required, Validators.email]],
      correoInstitucional:        ['', [Validators.email]],
      fechaNacimiento:            ['', Validators.required],
      telfConvencional:           ['', [Validators.minLength(9), Validators.maxLength(9), MyValidators.onlyNumbers()]],
      telfCelular:                ['', [Validators.minLength(10), Validators.maxLength(10), MyValidators.onlyNumbers()]],
      tipoSangre:                 [''],
      sexo:                     ['', Validators.required],
      tipoNacionalidad:           ['', Validators.required],
      provinciaNacimiento:        ['', Validators.required],
      cantonNacimiento:           [{value: '', disabled: true}, Validators.required],
      provinciaResidencia:        [''],
      cantonResidencia:           [{value: '', disabled: true}],
      callePrincipalResidencia:   [''],
      calleSecundariaResidencia:  [''],
      numeroCasa:                 [''],
      colegio:                    [''],
      nombreTituloSegundoNivel:               [''],
      paisTituloSegundoNivel:                 [''],
      ciudadTituloSegundoNivel:               [''],
      meritoDeportivoDescripcion: [''],
      meritoAcademicoDescripcion: [''],
      unidadGestion:              [''],
      grado:                      [''],
      rango:                      [{value: '', disabled: true}],
      cargo:                      [''],
    }, {updateOn: 'change'});

    this.fechaNacimientoField.valueChanges.subscribe({
      next: (fechaNacimiento) => {
        console.log(fechaNacimiento);
      }
    })
  }

  get nombreUsuarioField() {
    return this.formularioUsuario.get('nombreUsuario');
  }

  get apellidoField() {
    return this.formularioUsuario.get('apellido');
  }

  get correoPersonalField() {
    return this.formularioUsuario.get('correoPersonal');
  }

  get correoInstitucionalField() {
    return this.formularioUsuario.get('correoInstitucional');
  }

  get fechaNacimientoField() {
    return this.formularioUsuario.get('fechaNacimiento');
  }

  get nombreField() {
    return this.formularioUsuario.get('nombre');
  }

  get telfConvencionalField() {
    return this.formularioUsuario.get('telfConvencional');
  }

  get tipoSangreField() {
    return this.formularioUsuario.get('tipoSangre');
  }

  get provinciaNacimientoField() {
    return this.formularioUsuario.get('provinciaNacimiento');
  }

  get unidadGestionField() {
    return this.formularioUsuario.get('unidadGestion');
  }

  get sexoField() {
    return this.formularioUsuario.get('sexo');
  }

  get telfCelularField() {
    return this.formularioUsuario.get('telfCelular');
  }

  get cantonNacimientoField() {
    return this.formularioUsuario.get('cantonNacimiento');
  }

  get provinciaResidenciaField() {
    return this.formularioUsuario.get('provinciaResidencia');
  }

  get cantonResidenciaField() {
    return this.formularioUsuario.get('cantonResidencia');
  }

  get callePrincipalResidenciaField() {
    return this.formularioUsuario.get('callePrincipalResidencia');
  }

  get calleSecundariaResidenciaField() {
    return this.formularioUsuario.get('calleSecundariaResidencia');
  }

  get numeroCasaField() {
    return this.formularioUsuario.get('numeroCasa');
  }

  get colegioField() {
    return this.formularioUsuario.get('colegio');
  }

  get tipoNacionalidadField() {
    return this.formularioUsuario.get('tipoNacionalidad');
  }

  get nombreTituloSegundoNivelField() {
    return this.formularioUsuario.get('nombreTituloSegundoNivel');
  }

  get paisTituloSegundoNivelField() {
    return this.formularioUsuario.get('paisTituloSegundoNivel');
  }

  get ciudadTituloSegundoNivelField() {
    return this.formularioUsuario.get('ciudadTituloSegundoNivel');
  }

  get meritoDeportivoDescripcionField() {
    return this.formularioUsuario.get('meritoDeportivoDescripcion');
  }

  get meritoAcademicoDescripcionField() {
    return this.formularioUsuario.get('meritoAcademicoDescripcion');
  }

  get cargoField() {
    return this.formularioUsuario.get('cargo');
  }

  get gradoField() {
    return this.formularioUsuario.get('grado');
  }

  get rangoField() {
    return this.formularioUsuario.get('rango');
  }


  onMeritoDeportivoChange(event: any) {
    this.tieneMeritoDeportivo = event.target.checked;
    if (this.tieneMeritoDeportivo) {
      this.meritoDeportivoDescripcionField.setValidators([Validators.required]);
    } else {
      this.meritoDeportivoDescripcionField.clearValidators();
    }
    this.meritoDeportivoDescripcionField.updateValueAndValidity();
  }

  onMeritoAcademicoChange(event: any) {
    this.tieneMeritoAcademico = event.target.checked;

    if(this.tieneMeritoAcademico) {
      this.meritoAcademicoDescripcionField.setValidators([Validators.required]);
    } else {
      this.meritoAcademicoDescripcionField.clearValidators();
    }
    this.meritoAcademicoDescripcionField.updateValueAndValidity();
  }

  toggleValidationsNacionalidad() {
    const isExtranjero = this.tipoNacionalidadField.value === 'EXTRANJERO';

    this.provinciaNacimientoField.clearValidators();
    this.cantonNacimientoField.clearValidators();
      this.provinciaNacimientoField.setValue('');
      this.cantonNacimientoField.setValue('');
    this.formularioUsuario.get('cantonNacimiento')?.disable();
    this.cantonesNacimiento = [];

    if (!isExtranjero) {
      this.provinciaNacimientoField.setValidators([Validators.required]);
      this.cantonNacimientoField.setValidators([Validators.required]);
    }

    this.provinciaNacimientoField.updateValueAndValidity();
    this.cantonNacimientoField.updateValueAndValidity();
  }

  onChangeCantonNacimiento(event: any) {
    if(event === '') return;
    this.provinciaService.getCantonesPorProvincia(event).subscribe({
      next: (cantones) => {
        this.formularioUsuario.get('cantonNacimiento')?.enable();
        this.cantonesNacimiento = cantones;
        this.cantonNacimientoField.setValue('');
        },
      error: (err) => {console.log(err)}
    });
  }

  onChangeCantonResidencia(event: any) {
    if(event === '') return;

    this.provinciaService.getCantonesPorProvincia(event).subscribe({
      next: (cantones) => {
      this.formularioUsuario.get('cantonResidencia')?.enable();
        this.cantonesResidencia = cantones;
        this.cantonResidenciaField.setValue('');
        },
      error: (err) => {console.log(err)}
    });
  }

  onChangeGrado(event: any) {
    this.gradoService.getRangosPorGrado(event).subscribe({
      next: (rangos) => {this.formularioUsuario.get('rango')?.enable(); this.rangos = rangos;},
      error: (err) => {console.log(err)}
    })
  }

  crearUsuario() {
    if(this.formularioUsuario.invalid) {
      Notificacion.notificar(this.mdbNotificationService, 'Por favor, llene todos los campos obligatorios.', TipoAlerta.ALERTA_ERROR);
      this.formularioUsuario.markAllAsTouched();
      return;
    }

    this.showLoader(true);

    this.usuario = {
      ...this.usuario,
      nombreUsuario: this.nombreUsuarioField.value,
      codModulo: null,
      active: true,
      notLocked: true,
      codDatosPersonales: {
        ...this.usuario.codDatosPersonales,
        apellido                      : this.apellidoField.value,
        correoPersonal               : this.correoPersonalField.value,
        correoInstitucional          : this.correoInstitucionalField.value,
        fechaNacimiento              : this.fechaNacimientoField.value,
        nombre                        : this.nombreField.value,
        numTelefConvencional        : this.telfConvencionalField.value,
        numTelefCelular             : this.telfCelularField.value,
        tipoSangre                   : this.tipoSangreField.value,
        codCargo                     : this.cargoField.value,
        codGrado                     : this.gradoField.value,
        codRango                     : this.rangoField.value,
        codCantonNacimiento         : this.cantonNacimientoField.value,
        codCantonResidencia         : this.cantonResidenciaField.value,
        codProvinciaNacimiento      : this.provinciaNacimientoField.value,
        codProvinciaResidencia      : this.provinciaResidenciaField.value,
        callePrincipalResidencia    : this.callePrincipalResidenciaField.value,
        calleSecundariaResidencia   : this.calleSecundariaResidenciaField.value,
        numeroCasa                   : this.numeroCasaField.value,
        tipoNacionalidad             : this.tipoNacionalidadField.value,
        colegio                       : this.colegioField.value,
        nombreTituloSegundoNivel                 : this.nombreTituloSegundoNivelField.value,
        paisTituloSegundoNivel                   : this.paisTituloSegundoNivelField.value,
        ciudadTituloSegundoNivel                 : this.ciudadTituloSegundoNivelField.value,
        tieneMeritoDeportivo        : this.tieneMeritoDeportivo,
        meritoDeportivoDescripcion  : this.meritoDeportivoDescripcionField.value,
        tieneMeritoAcademico        : this.tieneMeritoAcademico,
        meritoAcademicoDescripcion  : this.meritoAcademicoDescripcionField.value,
        codUnidadGestion            : this.unidadGestionField.value,
        sexo                        : this.sexoField.value,
        cedula                        : this.nombreUsuarioField.value,
        estado                        : 'ACTIVO',
        residePais                   : this.tieneNacionalidadEcuatoriana || this.tieneNacionalidadComunidadFrontera,
        codDocumentoImagen          : null,                
        codEstacion                  : null,
        pinValidacionCorreo         : null,
        validacionCorreo             : null

      }

    }

    console.log(this.usuario);

    this.usuarioService.crear(this.usuario).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        console.log(usuario);
        this.showLoader(false);
        this.close();
      },
      error: (err) => {
        console.error(err);
        this.showLoader(false);
        Notificacion.notificar(this.mdbNotificationService, 'Ha ocurrido un error al crear el usuario.', TipoAlerta.ALERTA_ERROR);
      }
    })
  }

  close(): void {
    const usuario = this.usuario;
    this.modalRef.close(usuario)
  }

  showLoader(show: boolean) {
    this.loading = show;
  }

}
