import {Component, OnInit, ViewChild} from '@angular/core';
import {CURSO_COMPLETO_ESTADO} from 'src/app/util/constantes/especializacion.const';
import {OPCIONES_DATEPICKER} from "../../../../util/constantes/opciones-datepicker.const";
import {ComponenteBase} from "../../../../util/componente-base";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CargaArchivoService} from "../../../../servicios/carga-archivo";
import {RequisitoService} from "../../../../servicios/requisito.service";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {Router} from "@angular/router";
import {TipoCurso} from "../../../../modelo/flujos/especializacion/tipo-curso";
import {CatalogoCurso} from "../../../../modelo/flujos/especializacion/catalogo-curso";
import {Requisito} from "../../../../modelo/admin/requisito";
import {TipoCursoService} from "../../../../servicios/especializacion/tipo-curso.service";
import {CatalogoCursoService} from "../../../../servicios/especializacion/catalogo-curso.service";
import {Notificacion} from "../../../../util/notificacion";
import {Curso} from "../../../../modelo/flujos/especializacion/curso";
import {Usuario} from "../../../../modelo/admin/usuario";
import {AutenticacionService} from "../../../../servicios/autenticacion.service";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {DocumentoFormacion} from "../../../../modelo/flujos/formacion/documento";
import {Aula} from "../../../../modelo/admin/aula";
import {AulaService} from "../../../../servicios/aula.service";
import {DescargaArchivoUtil} from "../../../../util/descarga";
import {MdbStepChangeEvent, MdbStepperComponent} from "mdb-angular-ui-kit/stepper";
import {CursoService} from "../../../../servicios/especializacion/curso.service";
import {CursosService} from "../../../../servicios/especializacion/cursos.service";

@Component({
  selector: 'app-editar-curso',
  templateUrl: './editar-curso.component.html',
  styleUrls: ['./editar-curso.component.scss']
})
export class EditarCursoComponent extends ComponenteBase implements OnInit {
  // referencia a la constante ESPECIALIZACION
  public ESPECIALIZACION = CURSO_COMPLETO_ESTADO;

  // fechas
  protected readonly OPCIONES_DATEPICKER = OPCIONES_DATEPICKER;
  fechaActual = new Date();

  // tipo curso y catálogo curso
  listaTipoCurso: TipoCurso[];
  tipoCursoSeleccionado: TipoCurso;

  listaCatalogoCurso: CatalogoCurso[];
  catalogoCursoSeleccionado: CatalogoCurso;

  // requisitos
  requisitosCurso: Requisito[];
  listaRequisitos: Requisito[];
  requisitoSeleccionado: Requisito;
  itemRequisito: Requisito;
  @ViewChild('table') table!: MdbTableDirective<Requisito>;
  editElementIndex = -1;
  addRow = false;


  //form curso
  cursoForm: FormGroup;
  curso: Curso;

  //documentos
  // gestión de archivos
  @ViewChild('archivoMdbInput') inputArchivo: any;
  documentos: DocumentoFormacion[] = [];
  archivoCurso: File = null;
  listaArchivosCurso: File[] = [];
  headersArchivos = [
    {key: 'nombre', label: 'Nombre Documento'},
  ];

  //usuario actual
  private usuarioActual: Usuario = null;

  // aulas catálogo
  aulasCatalogo: Aula[];

  // curso
  private cursoCreado: boolean = false;

  // selección de curso
  cursoSeleccionado: Curso;
  cursos: Curso[];
  estaCargando: boolean;
  esVistaListaCursos: boolean;
  esVistaValidacionCurso: boolean;


  // stepper
  @ViewChild('stepper') stepper!: MdbStepperComponent;

  constructor(
    private formBuilder: FormBuilder,
    // catalogo curso
    private tipoCursoService: TipoCursoService,
    private catalogoCursoService: CatalogoCursoService,
    // documentos
    private cargaArchivoService: CargaArchivoService,
    // requisitos
    private servicioRequisito: RequisitoService,
    // util
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private router: Router,
    // usuario actual
    private autenticacionService: AutenticacionService,
    // aulas
    private aulasService: AulaService,
    // curso
    private cursoService: CursoService,
    // lista de cursos
    private cursosService: CursosService,
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.subscriptions = [];
    this.listaTipoCurso = [];
    this.listaCatalogoCurso = [];
    this.listaRequisitos = [];
    this.requisitosCurso = [];
    this.requisitoSeleccionado = null;
    this.aulasCatalogo = [];
    this.cursoSeleccionado = null;
    this.cursos = [];
    this.showLoading = false;
    this.estaCargando = true;
    this.esVistaListaCursos = true;
    this.esVistaValidacionCurso = false;

    this.listarCursos();

    this.construirFormCurso();


  }

  ngOnInit(): void {

    // obtiene usuario actual para registrar en el curso
    this.autenticacionService.user$.subscribe({
      next: usuario => {
        this.usuarioActual = usuario
      }
    })

    this.listarCursos();

    // carga lista de tipo curso, selecciona por defecto el primer elemento y carga la lista de catalogo curso correspondiente
    this.listarTipoCurso();

    // carga lista de requisitos
    this.listarRequisitos();

    // carga lista de aulas
    this.listarAulas();

    // inicialización catálogos
    //this.initCurso();

  }

// lista de cursos
  private listarCursos() {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.VALIDACION_CURSO).subscribe({
      next: (cursos) => {
        this.cursos = cursos
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


// catalogo curso
  public listarTipoCurso(): void {
    this.subscriptions.push(
      this.tipoCursoService.get().subscribe({
        next: (tipoCurso) => {
          this.listaTipoCurso = tipoCurso;

          if (this.listaTipoCurso.length == 0) {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, "No existen tipos de curso registrados. Contacte al administrador.");
            return;
          }

          this.tipoCursoSeleccionado = this.listaTipoCurso[0];

          this.listarCatalogoCurso();
        },
        error: (error) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, error.error.mensaje);
        }
      }));
  }

  public listarCatalogoCurso(): void {
    this.subscriptions.push(
      this.catalogoCursoService.getPorTipoCurso(this.tipoCursoSeleccionado.codTipoCurso).subscribe({
        next: (catalogoCurso) => {
          this.listaCatalogoCurso = catalogoCurso;

          if (this.listaCatalogoCurso.length == 0) {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, "No existen cursos registrados para el tipo de curso: " + this.tipoCursoSeleccionado.nombreTipoCurso + ". Contacte al administrador.");
            return;
          }

          // selecciona por defecto el primer elemento
          this.catalogoCursoSeleccionado = this.listaCatalogoCurso[0];
        },
        error: (error) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, error.error.mensaje);
        }
      }));
  }

  onTipoCursoChange(): void {

    this.catalogoCursoSeleccionado = null;

    this.listarCatalogoCurso();
  }

// aulas
  public listarAulas(): void {
    this.subscriptions.push(
      this.aulasService.listar().subscribe({
        next: (aulas) => {
          this.aulasCatalogo = aulas;

          if (this.aulasCatalogo.length == 0) {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, "No existen aulas registradas. Contacte al administrador.");
            return;
          }

          this.codAulaField.setValue(this.aulasCatalogo[0].codAula);

        },
        error: (error) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, error.error.mensaje);

        }
      }));
  }

///////////////////////////////////////////
// requisitos
///////////////////////////////////////////
  public listarRequisitos(): void {
    this.subscriptions.push(
      this.servicioRequisito.getRequisito().subscribe({
        next: (requisitos) => {
          this.listaRequisitos = requisitos;

          this.requisitoSeleccionado = this.listaRequisitos[0];

          if (this.listaRequisitos.length == 0) {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, "No existen requisitos registrados. Contacte al administrador.");
            return;
          }

        },
        error: (error) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, error.error.mensaje);
        }
      }));
  }

  agregarRequisito() {
    this.requisitosCurso.push(this.itemRequisito);
    this.requisitosCurso.sort((a, b) => a.nombre.localeCompare(b.nombre));

    this.listaRequisitos = this.listaRequisitos.filter((requisito) => requisito.codigoRequisito !== this.itemRequisito.codigoRequisito);
    this.listaRequisitos = [...this.listaRequisitos];

    this.editElementIndex = -1;
    this.addRow = false;
    this.itemRequisito = null;
  }

  eliminarRequisito(codRequisito: number) {

    const requisito = this.requisitosCurso.find((r) => r.codigoRequisito === codRequisito);
    this.listaRequisitos.push(requisito);

    this.requisitosCurso = this.requisitosCurso.filter((requisito) => requisito.codigoRequisito !== codRequisito);
    this.requisitosCurso = [...this.requisitosCurso];

    this.listaRequisitos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    this.listaRequisitos = [...this.listaRequisitos];

  }

////////////////////////////////////////////////////
// form curso - campos de interface Curso
////////////////////////////////////////////////////
  private construirFormCurso(): void {
    // construye el formulario con campos de interface Curso
    this.cursoForm = this.formBuilder.group({
      //codCursoEspecializacion: ['', Validators.required],
      codAula: ['', Validators.required],
      numeroCupo: ['', Validators.required],
      fechaInicioCurso: ['', Validators.required],
      fechaFinCurso: ['', Validators.required],
      //fechaInicioCargaNota: ['', Validators.required],
      //fechaFinCargaNota: ['', Validators.required],
      notaMinima: ['', Validators.required],
      //apruebaCreacionCurso: ['', Validators.required],
      //codCatalogoCursos: ['', Validators.required],
      //estado: ['', Validators.required],
      emailNotificacion: ['', [Validators.required, Validators.email]],
      tieneModulos: [''],
      porcentajeAceptacionCurso: ['', Validators.required],
      //codUsuarioCreacion: ['', Validators.required],
      //codUsuarioValidacion: ['', Validators.required],
      nombre: ['', Validators.required]
    });
  }

// getters form curso

  get codAulaField() {
    return this.cursoForm.get('codAula');
  }

  get numeroCupoField() {
    return this.cursoForm.get('numeroCupo');
  }

  get fechaInicioCursoField() {
    return this.cursoForm.get('fechaInicioCurso');
  }

  get fechaFinCursoField() {
    return this.cursoForm.get('fechaFinCurso');
  }

  get fechaInicioCargaNotaField() {
    return this.cursoForm.get('fechaInicioCargaNota');
  }

  get fechaFinCargaNotaField() {
    return this.cursoForm.get('fechaFinCargaNota');
  }

  get notaMinimaField() {
    return this.cursoForm.get('notaMinima');
  }

  get emailNotificacionField() {
    return this.cursoForm.get('emailNotificacion');
  }

  get tieneModulosField() {
    return this.cursoForm.get('tieneModulos');
  }

  get porcentajeAceptacionCursoField() {
    return this.cursoForm.get('porcentajeAceptacionCurso');
  }

  get nombreField() {
    return this.cursoForm.get('nombre');
  }

// setters form curso

  set codAula(codAula: number) {
    this.cursoForm.get('codAula').setValue(codAula);
  }

  set numeroCupo(numeroCupo: number) {
    this.cursoForm.get('numeroCupo').setValue(numeroCupo);
  }

  set fechaInicioCurso(fechaInicioCurso: Date) {
    this.cursoForm.get('fechaInicioCurso').setValue(fechaInicioCurso);
  }

  set fechaFinCurso(fechaFinCurso: Date) {
    this.cursoForm.get('fechaFinCurso').setValue(fechaFinCurso);
  }

  set fechaInicioCargaNota(fechaInicioCargaNota: Date) {
    this.cursoForm.get('fechaInicioCargaNota').setValue(fechaInicioCargaNota);
  }

  set fechaFinCargaNota(fechaFinCargaNota: Date) {
    this.cursoForm.get('fechaFinCargaNota').setValue(fechaFinCargaNota);
  }

  set notaMinima(notaMinima: number) {
    this.cursoForm.get('notaMinima').setValue(notaMinima);
  }

  set emailNotificacion(emailNotificacion: string) {
    this.cursoForm.get('emailNotificacion').setValue(emailNotificacion);
  }

  set tieneModulos(tieneModulos: boolean) {
    this.cursoForm.get('tieneModulos').setValue(tieneModulos);
  }

  set porcentajeAceptacionCurso(porcentajeAceptacionCurso: number) {
    this.cursoForm.get('porcentajeAceptacionCurso').setValue(porcentajeAceptacionCurso);
  }

  set nombre(nombre: string) {
    this.cursoForm.get('nombre').setValue(nombre);
  }

  /*private initCurso() {
    this.curso = {
      codCursoEspecializacion: null,
      codAula: null,
      numeroCupo: 30,
      fechaInicioCurso: this.fechaActual,
      fechaFinCurso: null,
      fechaInicioCargaNota: this.fechaActual,
      fechaFinCargaNota: this.fechaActual,
      notaMinima: 0,
      apruebaCreacionCurso: false,
      codCatalogoCursos: this.catalogoCursoSeleccionado ? this.catalogoCursoSeleccionado.codCatalogoCursos : null,
      estado: this.ESPECIALIZACION.INICIO,
      emailNotificacion: null,
      tieneModulos: false,
      porcentajeAceptacionCurso: 0,
      codUsuarioCreacion: this.usuarioActual ? this.usuarioActual.codUsuario : null,
      codUsuarioValidacion: null,
      nombre: 'Nombre del curso'
    };
  }*/

//copia valores de formulario a objeto curso
  private copiarValoresFormCurso() {

    // fechas
    /*const fechaInicioOriginal = new Date(this.cursoSeleccionado.fechaInicioCurso);
    const fechaFinOriginal = new Date(this.cursoSeleccionado.fechaFinCurso);*/

    const fechaInicioOriginal = new Date(this.fechaInicioCursoField.getRawValue());
    const fechaFinOriginal = new Date(this.fechaFinCursoField.getRawValue());

    fechaInicioOriginal.setMinutes(fechaInicioOriginal.getMinutes() + fechaInicioOriginal.getTimezoneOffset());
    fechaFinOriginal.setMinutes(fechaFinOriginal.getMinutes() + fechaFinOriginal.getTimezoneOffset());

    this.curso.codAula = this.codAulaField.value;
    this.curso.numeroCupo = this.numeroCupoField.value;
    this.curso.fechaInicioCurso = fechaInicioOriginal;
    this.curso.fechaFinCurso = fechaFinOriginal;
    this.curso.notaMinima = this.notaMinimaField.value;
    this.curso.emailNotificacion = this.emailNotificacionField.value;
    this.curso.tieneModulos = this.tieneModulosField.value;
    this.curso.porcentajeAceptacionCurso = this.porcentajeAceptacionCursoField.value;
    this.curso.nombre = this.nombreField.value;

    this.curso.codCatalogoCursos = this.catalogoCursoSeleccionado.codCatalogoCursos;
  }

///////////////////////////////////////////
// gestión archivos pruebas
///////////////////////////////////////////


  /*  descargarArchivo(documento: DocumentoFormacion) {
      this.documentoPruebaService.descargar(documento.codDocumento).subscribe({
        next: (data) => {
          const blob = new Blob([data] /!*, { type: 'application/pdf' }*!/);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${documento.nombre}`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.log('Error al descargar documento', error);
          Notificacion.notificar(this.notificationServiceLocal, 'Error al descargar documento', TipoAlerta.ALERTA_ERROR);
        },
      });
    }*/

  cargarArchivoCurso(event: any) {
    this.archivoCurso = event.target.files[0];
    this.listaArchivosCurso.push(this.archivoCurso);

    this.listaArchivosCurso = [...this.listaArchivosCurso];
    this.archivoCurso = null;

    this.inputArchivo.value = '';

    this.addRow = false;
  }

  descargar(index: number) {
    DescargaArchivoUtil.descargarArchivo(this.listaArchivosCurso[index]);
  }

  eliminar(index
             :
             number
  ) {
    this.listaArchivosCurso.splice(index, 1);
    this.listaArchivosCurso = [...this.listaArchivosCurso];
  }

  /*crear() {
    if (this.archivoPrueba === null) return;

    const formData = new FormData();
    formData.append('pruebaDetalle', this.pruebaDetalleSeleccionada.codPruebaDetalle.toString());
    formData.append('archivo', this.archivoPrueba);

    this.documentoPruebaService
      .guardarArchivo(formData)
      .pipe(
        tap(() => {
          this.documentoPruebaService
            .listar(this.pruebaDetalleSeleccionada.codPruebaDetalle)
            .subscribe((documentos) => {
              this.documentos = documentos;
              Notificacion.notificar(
                this.notificationServiceLocal,
                'Documento creado correctamente',
                TipoAlerta.ALERTA_OK
              );
            });
          this.addRow = false;
        }),
        catchError((error) => {
          console.log('Error al crear documento', error);
          Notificacion.notificar(this.notificationServiceLocal, 'Error al crear documento', TipoAlerta.ALERTA_ERROR);
          this.addRow = false;
          return throwError(error);
        })
      )
      .subscribe();
  }*/

//TODO revisar endpoint
  /*eliminar(codDocumento: number) {
    const codPruebaDetalle = this.pruebaDetalleSeleccionada.codPruebaDetalle;

    this.documentoPruebaService.eliminar(codPruebaDetalle, codDocumento).subscribe({
      next: () => {
        let index = this.documentos.findIndex((documento) => documento.codDocumento == codDocumento);
        this.documentos.splice(index, 1);
        this.documentos = [...this.documentos];
        Notificacion.notificar(
          this.notificationServiceLocal,
          'Documento eliminado correctamente',
          TipoAlerta.ALERTA_OK
        );
      },
      error: (error) => {
        console.log('Error al eliminar documento', error);
        Notificacion.notificar(this.notificationServiceLocal, 'Error al eliminar documento', TipoAlerta.ALERTA_ERROR);
      },
    });
  }*/


// util step change
  onStepChange(event: MdbStepChangeEvent) {
    const activeStep = event.activeStepIndex;
    const previousStep = event.previousStepIndex;

    console.log('activeStep', activeStep);
    console.log('previousStep', previousStep);

    this.copiarValoresFormCurso();

    switch (activeStep) {
      case 0:

        break;
      case 1:

        break;
      case 2:

        break;
      default:

        break;

    }
  }

// actualizar de curso
  public editarCurso() {
    // verificar que fechainicio sea menor a fechafin

    const fInicio: Date = this.fechaInicioCursoField.getRawValue();
    const fFin: Date = this.fechaFinCursoField.getRawValue();

    if (fInicio >= fFin) {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'La fecha de inicio debe ser menor a la fecha de fin');
      return;
    }

    this.showLoading = true;

    this.copiarValoresFormCurso();

    // asigna la lista de requisitos al objeto curso
    this.curso.requisitos = this.requisitosCurso;

    const formData = new FormData();

    // asigna el objeto curso al formData
    formData.append('datos', JSON.stringify(this.curso));

    console.log(this.curso)
    console.log(JSON.stringify(this.curso))

    // actualiza el curso
    this.subscriptions.push(
      this.cursoService.actualizar(this.curso).subscribe({
        next: (data) => {
          this.showLoading = false;
          this.cursoCreado = true;


          // llama a servicio para actualizar los requisitos del curso

          this.subscriptions.push(
            this.cursoService.actualizarRequisitos(this.requisitosCurso, this.curso.codCursoEspecializacion).subscribe({
                next: (data) => {
                  Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Curso actualizado correctamente');

                  this.stepper.next();
                },
                error: (error) => {
                  this.showLoading = false;
                  Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, error);
                }
              }
            ));

          ////////////////////////////////////////////

        },
        error: (error) => {
          this.showLoading = false;
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, error);
        }
      })
    );
  }


// selección de curso y carga de información
  cursoSeleccionadoEvent($event: Curso) {
    this.cursoSeleccionado = $event;
    this.cargarInformacionCurso(this.cursoSeleccionado).then(
      () => {
        this.esVistaListaCursos = false;
        this.esVistaValidacionCurso = true;

        //deep copy de curso seleccionado a objeto temporal curso
        this.curso = JSON.parse(JSON.stringify(this.cursoSeleccionado));


        // carga la info del curso seleccionado al formulario
        this.cargarValoresFormCurso();



      }
    );
    console.log($event)
  }

  volverAListaCursos() {

    this.cursos = [];

    this.listarCursos();

    this.esVistaListaCursos = true;
    this.esVistaValidacionCurso = false;
    this.cursoSeleccionado = null;
  }

  private async cargarInformacionCurso(curso: Curso) {
    await this.cursosService.getTipoCurso(curso.codCatalogoCursos).subscribe({
      next: (tipoCursoResp) => {
        this.cursoSeleccionado.tipoCurso = tipoCursoResp;

        // establece tipo curso y catalogo curso seleccionados

        // busca en lista catalogo cursos el catalogo curso seleccionado
        this.catalogoCursoSeleccionado = this.listaCatalogoCurso.find((catalogoCurso) => catalogoCurso.codCatalogoCursos == this.cursoSeleccionado.codCatalogoCursos);

        // busca en lista tipo cursos el tipo curso seleccionado
        this.tipoCursoSeleccionado = this.listaTipoCurso.find((tipoCurso) => tipoCurso.codTipoCurso == this.catalogoCursoSeleccionado.codTipoCurso);

      },
      error: (err) => {
        console.error(err);
        Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, err);
      }
    });
  }

  cargarValoresFormCurso() {

    // fechas
    const fechaInicioOriginal = new Date(this.cursoSeleccionado.fechaInicioCurso);
    const fechaFinOriginal = new Date(this.cursoSeleccionado.fechaFinCurso);

    fechaInicioOriginal.setMinutes(fechaInicioOriginal.getMinutes() + fechaInicioOriginal.getTimezoneOffset());
    fechaFinOriginal.setMinutes(fechaFinOriginal.getMinutes() + fechaFinOriginal.getTimezoneOffset());


    // asigna los valores del curso al formulario
    this.nombreField.setValue(this.cursoSeleccionado.nombre);
    this.fechaInicioCursoField.setValue(fechaInicioOriginal);
    this.fechaFinCursoField.setValue(fechaFinOriginal);
    this.numeroCupoField.setValue(this.cursoSeleccionado.numeroCupo);
    this.notaMinimaField.setValue(this.cursoSeleccionado.notaMinima);
    this.porcentajeAceptacionCursoField.setValue(this.cursoSeleccionado.porcentajeAceptacionCurso);
    this.emailNotificacionField.setValue(this.cursoSeleccionado.emailNotificacion);
    this.codAulaField.setValue(this.cursoSeleccionado.codAula);
    this.tieneModulosField.setValue(this.cursoSeleccionado.tieneModulos);

    this.requisitosCurso = this.cursoSeleccionado.requisitos;

  }

}
