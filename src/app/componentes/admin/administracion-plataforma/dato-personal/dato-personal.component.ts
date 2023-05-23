import {Component, OnInit} from '@angular/core';
import {MdbModalRef} from 'mdb-angular-ui-kit/modal';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MyValidators} from "../../../../util/validators";
import {Usuario} from "../../../../modelo/admin/usuario";
import {Provincia} from "../../../../modelo/admin/provincia";
import {Canton} from "../../../../modelo/admin/canton";
import {DatoPersonal} from "../../../../modelo/admin/dato-personal";
import TipoSangreEnum from "../../../../enum/tipo-sangre.enum";
import {Grado} from "../../../../modelo/admin/institucionales/grado";
import {Rango} from "../../../../modelo/admin/institucionales/rango";
import {Cargo} from "../../../../modelo/admin/institucionales/cargo";
import {OPCIONES_DATEPICKER} from "../../../../util/constantes/opciones-datepicker.const";
import {UnidadGestion} from "../../../../modelo/admin/unidad-gestion";
import {ProvinciaService} from "../../../../servicios/provincia.service";
import {CargoService} from "../../../../servicios/cargo.service";
import {GradoService} from "../../../../servicios/grado.service";
import {UnidadGestionService} from "../../../../servicios/unidad-gestion.service";
import {DatoPersonalService} from "../../../../servicios/dato-personal.service";
import {Notificacion} from "../../../../util/notificacion";
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";

@Component({
  selector: 'app-dato-personal',
  templateUrl: './dato-personal.component.html',
  styleUrls: ['./dato-personal.component.scss']
})
export class DatoPersonalComponent implements OnInit {

  protected readonly opcionesDatepicker = OPCIONES_DATEPICKER;

  usuario                       : Usuario;
  datosPersonales               : DatoPersonal;
  formularioDatoPersonal        : FormGroup;
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
  hoy                           : Date;
  tieneNacionalidadEcuatoriana        : boolean;
  tieneNacionalidadComunidadFrontera  : boolean;
  tieneNacionalidadExtranjera         : boolean;

  constructor(
    public datoPersonalComponentMdbModalRef: MdbModalRef<DatoPersonalComponent>,
    private builder: FormBuilder,
    private provinciaService: ProvinciaService,
    private cargoService: CargoService,
    private gradoService: GradoService,
    private unidadGestionService: UnidadGestionService,
    private datoPersonalService: DatoPersonalService,
    private mdbNotificationService: MdbNotificationService
  ) {
    this.cantonesNacimiento = [];
    this.cantonesResidencia = [];
    this.provincias = [];
    this.unidadesGestion = [];
    this.grados = [];
    this.rangos = [];
    this.cargos = [];
    this.tieneMeritoAcademico = false;
    this.tieneMeritoDeportivo = false;
    this.formularioDatoPersonal = new FormGroup({});
    this.usuario = new Usuario();
    this.hoy = new Date();
    this.datosPersonales = {} as DatoPersonal;
    this.tiposSangre = Object.values(TipoSangreEnum)
    this.tieneNacionalidadComunidadFrontera = false;
    this.tieneNacionalidadEcuatoriana = false;
    this.tieneNacionalidadExtranjera = false;
  }

  ngOnInit(): void {
    this.datosPersonales = this.usuario.codDatosPersonales;
    console.log("DATO PERSONAL:", this.datosPersonales);
    this.datosPersonales.fecha_nacimiento = new Date(this.usuario.codDatosPersonales.fecha_nacimiento);
    this.tieneNacionalidadEcuatoriana = this.datosPersonales.tipo_nacionalidad === ('ECUATORIANA');
    this.tieneNacionalidadComunidadFrontera = this.datosPersonales.tipo_nacionalidad === ('COMUNIDAD FRONTERA');
    this.tieneNacionalidadExtranjera = this.datosPersonales.tipo_nacionalidad === ('EXTRANJERO');

    this.provinciaService.getProvincias().subscribe({
      next: (provincias) => {this.provincias = provincias},
      error: (error) => {console.log(error)}
    });
    if(this.datosPersonales.cod_provincia_nacimiento){
      this.provinciaService.getCantonesPorProvincia(this.datosPersonales?.cod_provincia_nacimiento).subscribe({
        next: (cantones) => {this.cantonesNacimiento = cantones},
        error: (error) => {console.log(error)}
      });
    }
    if(this.datosPersonales.cod_provincia_residencia){
      this.provinciaService.getCantonesPorProvincia(this.datosPersonales?.cod_provincia_residencia).subscribe({
        next: (cantones) => {this.cantonesResidencia = cantones},
        error: (error) => {console.log(error)}
      });
    }
    this.gradoService.getGrados().subscribe({
      next: (grados) => {this.grados = grados},
      error: (error) => {console.log(error)}
    });
    this.cargoService.getCargos().subscribe({
      next: (cargos) => {this.cargos = cargos},
      error: (error) => {console.log(error)}
    });
    this.unidadGestionService.getUnidadGestion().subscribe({
      next: (unidadesGestion) => {this.unidadesGestion = unidadesGestion},
      error: (error) => {console.log(error)}
    })
    if(this.datosPersonales.cod_grado){
      this.gradoService.getRangosPorGrado(this.datosPersonales?.cod_grado).subscribe({
        next: (rangos) => {this.rangos = rangos},
        error: (error) => {console.log(error)}
      })
    }
    this.construirFormulario();
    this.matchDatosPersonales();
  }

  private construirFormulario() {
    this.formularioDatoPersonal = this.builder.group({

      nombre:                     ['', [Validators.required, Validators.minLength(3), MyValidators.onlyLetters()]],
      apellido:                   ['', [Validators.required, Validators.minLength(3), MyValidators.onlyLetters()]],
      correoPersonal:             ['', [Validators.required, Validators.email]],
      correoInstitucional:        ['', [Validators.email]],
      fechaNacimiento:            ['', [Validators.required]],
      telfConvencional:           ['', [Validators.minLength(9), Validators.maxLength(9), MyValidators.onlyNumbers()]],
      telfCelular:                ['', [Validators.minLength(10), Validators.maxLength(10), MyValidators.onlyNumbers()]],
      tipoSangre:                 [''],
      genero:                     ['', [Validators.required]],
      tipoNacionalidad:           ['', [Validators.required]],
      provinciaNacimiento:        ['', [Validators.required]],
      cantonNacimiento:           [{value: '', disabled: true}, [Validators.required]],
      provinciaResidencia:        [''],
      cantonResidencia:           [{value: '', disabled: true}],
      callePrincipalResidencia:   [''],
      calleSecundariaResidencia:  [''],
      numeroCasa:                 [''],
      colegio:                    [''],
      nombreTitulo:               [''],
      paisTitulo:                 [''],
      ciudadTitulo:               [''],
      meritoDeportivoDescripcion: [''],
      meritoAcademicoDescripcion: [''],
      unidadGestion:              [''],
      grado:                      [''],
      rango:                      [{value: '', disabled: true}],
      cargo:                      [''],
    }, {updateOn: 'change'});
  }

  private matchDatosPersonales() {
    this.tieneMeritoAcademico = this.datosPersonales.tiene_merito_academico;
    this.tieneMeritoDeportivo = this.datosPersonales.tiene_merito_deportivo;
    this.formularioDatoPersonal.patchValue({
      nombre: this.datosPersonales.nombre,
      apellido: this.datosPersonales.apellido,
      correoPersonal: this.datosPersonales.correo_personal,
      correoInstitucional: this.datosPersonales.correo_institucional,
      fechaNacimiento: this.datosPersonales.fecha_nacimiento,
      telfConvencional: this.datosPersonales.num_telef_convencional,
      telfCelular: this.datosPersonales.num_telef_celular,
      tipoSangre: this.datosPersonales.tipo_sangre,
      genero: this.datosPersonales.genero,
      tipoNacionalidad: this.datosPersonales.tipo_nacionalidad,
      provinciaNacimiento: this.datosPersonales.cod_provincia_nacimiento,
      cantonNacimiento: this.datosPersonales.cod_canton_nacimiento,
      provinciaResidencia: this.datosPersonales.cod_provincia_residencia,
      cantonResidencia: this.datosPersonales.cod_canton_residencia,
      callePrincipalResidencia: this.datosPersonales.calle_principal_residencia,
      calleSecundariaResidencia: this.datosPersonales.calle_secundaria_residencia,
      numeroCasa: this.datosPersonales.numero_casa,
      colegio: this.datosPersonales.colegio,
      nombreTitulo: this.datosPersonales.nombre_titulo,
      paisTitulo: this.datosPersonales.pais_titulo,
      ciudadTitulo: this.datosPersonales.ciudad_titulo,
      meritoDeportivoDescripcion: this.datosPersonales.merito_deportivo_descripcion,
      meritoAcademicoDescripcion: this.datosPersonales.merito_academico_descripcion,
      unidadGestion: this.datosPersonales.cod_unidad_gestion,
      grado: this.datosPersonales.cod_grado,
      rango: this.datosPersonales.cod_rango,
      cargo: this.datosPersonales.cod_cargo,
    });
    this.datosPersonales.cod_canton_nacimiento === null ? this.cantonNacimientoField.disable() : this.cantonNacimientoField.enable();
    this.datosPersonales.cod_canton_residencia === null ? this.cantonResidenciaField.disable() : this.cantonResidenciaField.enable();
    this.toggleValidationsNacionalidad();
  }

  get apellidoField() {
    return this.formularioDatoPersonal.get('apellido');
  }

  get correoPersonalField() {
    return this.formularioDatoPersonal.get('correoPersonal');
  }

  get correoInstitucionalField() {
    return this.formularioDatoPersonal.get('correoInstitucional');
  }

  get fechaNacimientoField() {
    return this.formularioDatoPersonal.get('fechaNacimiento');
  }

  get nombreField() {
    return this.formularioDatoPersonal.get('nombre');
  }

  get telfConvencionalField() {
    return this.formularioDatoPersonal.get('telfConvencional');
  }

  get tipoSangreField() {
    return this.formularioDatoPersonal.get('tipoSangre');
  }

  get provinciaNacimientoField() {
    return this.formularioDatoPersonal.get('provinciaNacimiento');
  }

  get unidadGestionField() {
    return this.formularioDatoPersonal.get('unidadGestion');
  }

  get generoField() {
    return this.formularioDatoPersonal.get('genero');
  }

  get telfCelularField() {
    return this.formularioDatoPersonal.get('telfCelular');
  }

  get cantonNacimientoField() {
    return this.formularioDatoPersonal.get('cantonNacimiento');
  }

  get provinciaResidenciaField() {
    return this.formularioDatoPersonal.get('provinciaResidencia');
  }

  get cantonResidenciaField() {
    return this.formularioDatoPersonal.get('cantonResidencia');
  }

  get callePrincipalResidenciaField() {
    return this.formularioDatoPersonal.get('callePrincipalResidencia');
  }

  get calleSecundariaResidenciaField() {
    return this.formularioDatoPersonal.get('calleSecundariaResidencia');
  }

  get numeroCasaField() {
    return this.formularioDatoPersonal.get('numeroCasa');
  }

  get colegioField() {
    return this.formularioDatoPersonal.get('colegio');
  }

  get tipoNacionalidadField() {
    return this.formularioDatoPersonal.get('tipoNacionalidad');
  }

  get nombreTituloField() {
    return this.formularioDatoPersonal.get('nombreTitulo');
  }

  get paisTituloField() {
    return this.formularioDatoPersonal.get('paisTitulo');
  }

  get ciudadTituloField() {
    return this.formularioDatoPersonal.get('ciudadTitulo');
  }

  get meritoDeportivoDescripcionField() {
    return this.formularioDatoPersonal.get('meritoDeportivoDescripcion');
  }

  get meritoAcademicoDescripcionField() {
    return this.formularioDatoPersonal.get('meritoAcademicoDescripcion');
  }

  get cargoField() {
    return this.formularioDatoPersonal.get('cargo');
  }

  get gradoField() {
    return this.formularioDatoPersonal.get('grado');
  }

  get rangoField() {
    return this.formularioDatoPersonal.get('rango');
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
    const tipoNacionalidad = this.formularioDatoPersonal.get('tipoNacionalidad').value;
    const isExtranjero = tipoNacionalidad === 'EXTRANJERO';

    this.tieneNacionalidadEcuatoriana = tipoNacionalidad === 'ECUATORIANA';
    this.tieneNacionalidadExtranjera = isExtranjero;
    this.tieneNacionalidadComunidadFrontera = tipoNacionalidad === 'COMUNIDAD FRONTERA';

    this.provinciaNacimientoField.setValidators(isExtranjero ? null : [Validators.required]);
    this.cantonNacimientoField.setValidators(isExtranjero ? null : [Validators.required]);

    this.provinciaNacimientoField.updateValueAndValidity();
    this.cantonNacimientoField.updateValueAndValidity();

    this.provinciaNacimientoField.reset();
    this.cantonNacimientoField.reset();
  }

  onChangeCantonNacimiento(event: any) {
    if(event === '') return;
    this.provinciaService.getCantonesPorProvincia(event).subscribe({
      next: (cantones) => {
        this.formularioDatoPersonal.get('cantonNacimiento')?.enable();
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
        this.formularioDatoPersonal.get('cantonResidencia')?.enable();
        this.cantonesResidencia = cantones;
        this.cantonResidenciaField.setValidators([Validators.required]);
        this.cantonResidenciaField.setValue('');
      },
      error: (err) => {console.log(err)}
    });
  }

  onChangeGrado(event: any) {
    this.gradoService.getRangosPorGrado(event).subscribe({
      next: (rangos) => {this.formularioDatoPersonal.get('rango')?.enable(); this.rangos = rangos;},
      error: (err) => {console.log(err)}
    })
  }

  actualizarDatoPersonal() {
    if (this.formularioDatoPersonal.invalid) {
      Notificacion.notificar(this.mdbNotificationService, 'Por favor, llene todos los campos obligatorios.', TipoAlerta.ALERTA_ERROR);
      this.formularioDatoPersonal.markAllAsTouched();
      return;
    }

    this.datosPersonales = {
      ...this.datosPersonales,
      nombre                       : this.nombreField?.value,
      apellido                     : this.apellidoField?.value,
      correo_personal              : this.correoPersonalField?.value,
      correo_institucional         : this.correoInstitucionalField?.value,
      fecha_nacimiento             : this.fechaNacimientoField?.value,
      num_telef_convencional       : this.telfConvencionalField?.value,
      num_telef_celular            : this.telfCelularField?.value,
      tipo_sangre                  : this.tipoSangreField?.value,
      cod_provincia_nacimiento     : this.provinciaNacimientoField?.value,
      cod_canton_nacimiento        : this.cantonNacimientoField?.value,
      cod_provincia_residencia     : this.provinciaResidenciaField?.value,
      cod_canton_residencia        : this.cantonResidenciaField?.value,
      calle_principal_residencia   : this.callePrincipalResidenciaField?.value,
      calle_secundaria_residencia  : this.calleSecundariaResidenciaField?.value,
      numero_casa                  : this.numeroCasaField?.value,
      colegio                      : this.colegioField?.value,
      tipo_nacionalidad            : this.tipoNacionalidadField?.value,
      nombre_titulo                : this.nombreTituloField?.value,
      pais_titulo                  : this.paisTituloField?.value,
      ciudad_titulo                : this.ciudadTituloField?.value,
      tiene_merito_deportivo       : this.tieneMeritoDeportivo,
      merito_deportivo_descripcion : this.meritoDeportivoDescripcionField?.value,
      tiene_merito_academico       : this.tieneMeritoAcademico,
      merito_academico_descripcion : this.meritoAcademicoDescripcionField?.value,
      cod_cargo                    : this.cargoField?.value,
      cod_grado                    : this.gradoField?.value,
      cod_rango                    : this.rangoField?.value,
      genero                       : this.generoField?.value,
      cod_unidad_gestion           : this.unidadGestionField?.value,
    }

    this.datoPersonalService.update( this.datosPersonales, this.usuario.codDatosPersonales.cod_datos_personales).
    subscribe({
      next: (datoPersonal: DatoPersonal) => {
        this.usuario.codDatosPersonales = datoPersonal;
        this.close()
      },
      error: (err) => {console.log(err)}
    })
  }

  close(): void {
    const usuario: Usuario = this.usuario;
    console.log("Usuario actualizado",usuario);
    this.datoPersonalComponentMdbModalRef.close(usuario)
  }
}
