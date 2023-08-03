import {Component, OnInit, ViewChild} from '@angular/core';
import {ESPECIALIZACION} from 'src/app/util/constantes/especializacion.const';
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

@Component({
  selector: 'app-crear-curso',
  templateUrl: './crear-curso.component.html',
  styleUrls: ['./crear-curso.component.scss']
})
export class CrearCursoComponent extends ComponenteBase implements OnInit {
  // referencia a la constante ESPECIALIZACION
  public ESPECIALIZACION = ESPECIALIZACION;

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
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.subscriptions = [];
    this.listaTipoCurso = [];
    this.listaCatalogoCurso = [];
    this.listaRequisitos = [];
    this.requisitosCurso = [];
    this.requisitoSeleccionado = null;
    this.aulasCatalogo = [];

    this.construirFormCurso();

  }

  ngOnInit(): void {

    // obtiene usuario actual para registrar en el curso
    this.autenticacionService.user$.subscribe({
      next: usuario => {
        this.usuarioActual = usuario
      }
    })

    // carga lista de tipo curso, selecciona por defecto el primer elemento y carga la lista de catalogo curso correspondiente
    this.listarTipoCurso();

    // carga lista de requisitos
    this.listarRequisitos();

    // carga lista de aulas
    this.listarAulas();

    // inicialización catálogos
    this.initCurso();

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

  private initCurso() {
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
      estado: 'ACTIVO',
      emailNotificacion: null,
      tieneModulos: false,
      porcentajeAceptacionCurso: 0,
      codUsuarioCreacion: this.usuarioActual ? this.usuarioActual.codUsuario : null,
      codUsuarioValidacion: null,
      nombre: 'Nombre del curso'
    };
  }

  //copia valores de formulario a objeto curso
  private copiarValoresFormCurso() {
    this.curso.codAula = this.codAulaField.value;
    this.curso.numeroCupo = this.numeroCupoField.value;
    this.curso.fechaInicioCurso = this.fechaInicioCursoField.value;
    this.curso.fechaFinCurso = this.fechaFinCursoField.value;
    //this.curso.fechaInicioCargaNota = this.fechaInicioCargaNotaField.value;
    //this.curso.fechaFinCargaNota = this.fechaFinCargaNotaField.value;
    this.curso.notaMinima = this.notaMinimaField.value;
    this.curso.emailNotificacion = this.emailNotificacionField.value;
    this.curso.tieneModulos = this.tieneModulosField.value;
    this.curso.porcentajeAceptacionCurso = this.porcentajeAceptacionCursoField.value;
    this.curso.nombre = this.nombreField.value;
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

  eliminar(index: number) {
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

  // creacion de curso
  public crearCurso() {
    this.showLoading = true;

    this.initCurso();
    this.copiarValoresFormCurso();

    // asigna la lista de requisitos al objeto curso
    this.curso.requisitos = this.listaRequisitos;

    const formData = new FormData();

    // asigna el objeto curso al formData
    formData.append('datos', JSON.stringify(this.curso));

    // asigna la lista de archivos al formData
    for (let i = 0; i < this.listaArchivosCurso.length; i++) {
      formData.append('documentos', this.listaArchivosCurso[i]);
    }

    // crea el curso
    this.subscriptions.push(
      this.cursoService.crear(formData).subscribe({
        next: (data) => {
          this.showLoading = false;
          this.cursoCreado = true;
          this.stepper.next();
        },
        error: (error) => {
          this.showLoading = false;
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, error);
        }
      })
    );

  }
}
