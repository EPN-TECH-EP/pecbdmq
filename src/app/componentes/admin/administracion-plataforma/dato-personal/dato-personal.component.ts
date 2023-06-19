import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MyValidators } from "../../../../util/validators";
import { Usuario } from "../../../../modelo/admin/usuario";
import { Provincia } from "../../../../modelo/admin/provincia";
import { Canton } from "../../../../modelo/admin/canton";
import { DatoPersonal } from "../../../../modelo/admin/dato-personal";
import TipoSangreEnum from "../../../../enum/tipo-sangre.enum";
import { Grado } from "../../../../modelo/admin/institucionales/grado";
import { Rango } from "../../../../modelo/admin/institucionales/rango";
import { Cargo } from "../../../../modelo/admin/institucionales/cargo";
import { OPCIONES_DATEPICKER } from "../../../../util/constantes/opciones-datepicker.const";
import { UnidadGestion } from "../../../../modelo/admin/unidad-gestion";
import { ProvinciaService } from "../../../../servicios/provincia.service";
import { CargoService } from "../../../../servicios/cargo.service";
import { GradoService } from "../../../../servicios/grado.service";
import { UnidadGestionService } from "../../../../servicios/unidad-gestion.service";
import { DatoPersonalService } from "../../../../servicios/dato-personal.service";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { UsuarioService } from "../../../../servicios/usuario.service";
import { debounceTime, distinctUntilChanged, skip } from "rxjs/operators";

@Component({
  selector: 'app-dato-personal',
  templateUrl: './dato-personal.component.html',
  styleUrls: ['./dato-personal.component.scss']
})
export class DatoPersonalComponent implements OnInit {

  protected readonly opcionesDatepicker = OPCIONES_DATEPICKER;

  usuario: Usuario;
  datosPersonales: DatoPersonal;
  formularioDatoPersonal: FormGroup;
  provincias: Provincia[];
  cantonesNacimiento: Canton[];
  cantonesResidencia: Canton[];
  unidadesGestion: UnidadGestion[];
  grados: Grado[];
  rangos: Rango[];
  cargos: Cargo[];
  tiposSangre: string[];
  tieneMeritoAcademico: boolean;
  tieneMeritoDeportivo: boolean;
  hoy: Date;
  tieneNacionalidadEcuatoriana: boolean;
  tieneNacionalidadComunidadFrontera: boolean;
  tieneNacionalidadExtranjera: boolean;

  constructor(
    public datoPersonalComponentMdbModalRef: MdbModalRef<DatoPersonalComponent>,
    private builder: FormBuilder,
    private provinciaService: ProvinciaService,
    private cargoService: CargoService,
    private gradoService: GradoService,
    private unidadGestionService: UnidadGestionService,
    private datoPersonalService: DatoPersonalService,
    private mdbNotificationService: MdbNotificationService,
    private usuarioService: UsuarioService
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
    this.datosPersonales.fechaNacimiento = new Date(this.usuario.codDatosPersonales.fechaNacimiento);
    this.tieneNacionalidadEcuatoriana = this.datosPersonales.tipoNacionalidad === ('ECUATORIANA');
    this.tieneNacionalidadComunidadFrontera = this.datosPersonales.tipoNacionalidad === ('COMUNIDAD FRONTERA');
    this.tieneNacionalidadExtranjera = this.datosPersonales.tipoNacionalidad === ('EXTRANJERO');

    this.provinciaService.getProvincias().subscribe({
      next: (provincias) => {this.provincias = provincias},
      error: (error) => {console.log(error)}
    });
    if (this.datosPersonales.codProvinciaNacimiento) {
    this.provinciaService.getCantonesPorProvincia(this.datosPersonales?.codProvinciaNacimiento).subscribe({
      next: (cantones) => {this.cantonesNacimiento = cantones},
      error: (error) => {console.log(error)}
    });
    }
    if (this.datosPersonales.codProvinciaResidencia) {
    this.provinciaService.getCantonesPorProvincia(this.datosPersonales?.codProvinciaResidencia).subscribe({
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
    if (this.datosPersonales.codGrado) {
      this.gradoService.getRangosPorGrado(this.datosPersonales?.codGrado).subscribe({
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
      correoPersonal: ['', [Validators.required, Validators.email], MyValidators.emailExist(this.usuarioService)],
      correoInstitucional:        ['', [Validators.email]],
      fechaNacimiento:            ['', [Validators.required]],
      telfConvencional:           ['', [Validators.minLength(9), Validators.maxLength(9), MyValidators.onlyNumbers()]],
      telfCelular:                ['', [Validators.minLength(10), Validators.maxLength(10), MyValidators.onlyNumbers()]],
      tipoSangre:                 [''],
      sexo:                     ['', [Validators.required]],
      tipoNacionalidad:           ['', [Validators.required]],
      provinciaNacimiento:        ['', [Validators.required]],
      cantonNacimiento: [{ value: '', disabled: true }, [Validators.required]],
      provinciaResidencia:        [''],
      cantonResidencia: [{ value: '', disabled: true }],
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
      rango: [{ value: '', disabled: true }],
      cargo:                      [''],
    }, { updateOn: 'change' });
  }

  private matchDatosPersonales() {
    this.tieneMeritoAcademico = this.datosPersonales.tieneMeritoAcademico;
    this.tieneMeritoDeportivo = this.datosPersonales.tieneMeritoDeportivo;
    this.formularioDatoPersonal.patchValue({
      nombre:                     this.datosPersonales.nombre,
      apellido:                   this.datosPersonales.apellido,
      correoPersonal:             this.datosPersonales.correoPersonal,
      correoInstitucional:        this.datosPersonales.correoInstitucional,
      fechaNacimiento:            this.datosPersonales.fechaNacimiento,
      telfConvencional:           this.datosPersonales.numTelefConvencional,
      telfCelular:                this.datosPersonales.numTelefCelular,
      tipoSangre:                 this.datosPersonales.tipoSangre,
      sexo:                     this.datosPersonales.sexo,
      tipoNacionalidad:           this.datosPersonales.tipoNacionalidad,
      provinciaNacimiento:        this.datosPersonales.codProvinciaNacimiento,
      cantonNacimiento:           this.datosPersonales.codCantonNacimiento,
      provinciaResidencia:        this.datosPersonales.codProvinciaResidencia,
      cantonResidencia:           this.datosPersonales.codCantonResidencia,
      callePrincipalResidencia:   this.datosPersonales.callePrincipalResidencia,
      calleSecundariaResidencia:  this.datosPersonales.calleSecundariaResidencia,
      numeroCasa:                 this.datosPersonales.numeroCasa,
      colegio:                    this.datosPersonales.colegio,
      nombreTituloSegundoNivel:               this.datosPersonales.nombreTituloSegundoNivel,
      paisTituloSegundoNivel:                 this.datosPersonales.paisTituloSegundoNivel,
      ciudadTituloSegundoNivel:               this.datosPersonales.ciudadTituloSegundoNivel,
      meritoDeportivoDescripcion: this.datosPersonales.meritoDeportivoDescripcion,
      meritoAcademicoDescripcion: this.datosPersonales.meritoAcademicoDescripcion,
      unidadGestion:              this.datosPersonales.codUnidadGestion,
      grado:                      this.datosPersonales.codGrado,
      rango:                      this.datosPersonales.codRango,
      cargo:                      this.datosPersonales.codCargo,
    });
    this.datosPersonales.codCantonNacimiento === null ? this.cantonNacimientoField.disable() : this.cantonNacimientoField.enable();
    this.datosPersonales.codCantonResidencia === null ? this.cantonResidenciaField.disable() : this.cantonResidenciaField.enable();
    this.datosPersonales.codRango === null ? this.rangoField.disable() : this.rangoField.enable();

    const isExtranjero = this.formularioDatoPersonal?.get('tipoNacionalidad')?.value === 'EXTRANJERO';
    this.provinciaNacimientoField.setValidators(isExtranjero ? null : [Validators.required]);
    this.cantonNacimientoField.setValidators(isExtranjero ? null : [Validators.required]);

    this.verificarCorreoPersonal()
  }

  private verificarCorreoPersonal() {
    const correoActual = this.datosPersonales.correoPersonal;

    if (!this.correoPersonalField.touched){
      this.correoPersonalField.clearAsyncValidators()
      this.correoPersonalField.setValidators([Validators.required, Validators.email]);
      this.correoPersonalField.updateValueAndValidity();
    }

    this.formularioDatoPersonal.get('correoPersonal').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      skip(1)
    ).subscribe(
      (correoPersonal) => {
        if (correoPersonal === correoActual) {
          console.log('correo actual');
          this.correoPersonalField.clearAsyncValidators()
          this.correoPersonalField.setValidators([Validators.required, Validators.email]);
          this.correoPersonalField.updateValueAndValidity();
          return;
        }
        this.correoPersonalField.setValidators([Validators.required, Validators.email]);
        this.correoPersonalField.setAsyncValidators(MyValidators.emailExist(this.usuarioService));
        this.correoPersonalField.updateValueAndValidity();
      }
    );
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

  get sexoField() {
    return this.formularioDatoPersonal.get('sexo');
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

  get nombreTituloSegundoNivelField() {
    return this.formularioDatoPersonal.get('nombreTituloSegundoNivel');
  }

  get paisTituloSegundoNivelField() {
    return this.formularioDatoPersonal.get('paisTituloSegundoNivel');
  }

  get ciudadTituloSegundoNivelField() {
    return this.formularioDatoPersonal.get('ciudadTituloSegundoNivel');
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

    if (this.tieneMeritoAcademico) {
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

    this.provinciaNacimientoField.setValue('');
    this.cantonNacimientoField.setValue('');

  }

  onChangeCantonNacimiento(event: any) {
    if (event === '') return;
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
    if (event === '') return;
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
      next: (rangos) => {
        this.formularioDatoPersonal.get('rango')?.enable();
        this.rangos = rangos;
      },
      error: (err) => {console.log(err)}
    })
  }

  actualizarDatoPersonal() {
    if (this.formularioDatoPersonal.invalid) {
      Notificacion.notificar(this.mdbNotificationService, 'Por favor, llene todos los campos obligatorios.', TipoAlerta.ALERTA_ERROR);
      this.formularioDatoPersonal.markAllAsTouched();
      console.log(this.formularioDatoPersonal.controls);
      return;
    }

    this.datosPersonales = {
      ...this.datosPersonales,
      nombre: this.nombreField?.value,
      apellido: this.apellidoField?.value,
      correoPersonal: this.correoPersonalField?.value,
      correoInstitucional: this.correoInstitucionalField?.value,
      fechaNacimiento: this.fechaNacimientoField?.value,
      numTelefConvencional: this.telfConvencionalField?.value,
      numTelefCelular: this.telfCelularField?.value,
      tipoSangre: this.tipoSangreField?.value,
      codProvinciaNacimiento: this.provinciaNacimientoField?.value,
      codCantonNacimiento: this.cantonNacimientoField?.value,
      codProvinciaResidencia: this.provinciaResidenciaField?.value,
      codCantonResidencia: this.cantonResidenciaField?.value,
      callePrincipalResidencia: this.callePrincipalResidenciaField?.value,
      calleSecundariaResidencia: this.calleSecundariaResidenciaField?.value,
      numeroCasa: this.numeroCasaField?.value,
      colegio: this.colegioField?.value,
      tipoNacionalidad: this.tipoNacionalidadField?.value,
      nombreTituloSegundoNivel: this.nombreTituloSegundoNivelField?.value,
      paisTituloSegundoNivel: this.paisTituloSegundoNivelField?.value,
      ciudadTituloSegundoNivel: this.ciudadTituloSegundoNivelField?.value,
      tieneMeritoDeportivo: this.tieneMeritoDeportivo,
      meritoDeportivoDescripcion: this.meritoDeportivoDescripcionField?.value,
      tieneMeritoAcademico: this.tieneMeritoAcademico,
      meritoAcademicoDescripcion: this.meritoAcademicoDescripcionField?.value,
      codCargo: this.cargoField?.value,
      codGrado: this.gradoField?.value,
      codRango: this.rangoField?.value,
      sexo: this.sexoField?.value,
      codUnidadGestion: this.unidadGestionField?.value,
    }

    this.datoPersonalService.update(this.datosPersonales, this.usuario.codDatosPersonales.codDatosPersonales).subscribe({
      next: (datoPersonal: DatoPersonal) => {
        this.usuario.codDatosPersonales = datoPersonal;
        this.close()
      },
      error: (err) => {console.log(err)}
    })
  }

  close(): void {
    const usuario: Usuario = this.usuario;
    console.log("Usuario actualizado", usuario);
    this.datoPersonalComponentMdbModalRef.close(usuario)
  }
}
