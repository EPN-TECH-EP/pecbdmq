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
    documentoNuevo: File;

    //usuario actual
    private usuarioActual: Usuario = null;


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
    ) {
        super(notificationServiceLocal, popConfirmServiceLocal);

        this.subscriptions = [];
        this.listaTipoCurso = [];
        this.listaCatalogoCurso = [];
        this.listaRequisitos = [];
        this.requisitosCurso = [];
        this.requisitoSeleccionado = null;
        this.initCurso();

        this.autenticacionService.user$.subscribe({
            next: usuario => {
                this.usuarioActual = usuario
            }
        })
    }

    ngOnInit(): void {

        // carga lista de tipo curso, selecciona por defecto el primer elemento y carga la lista de catalogo curso correspondiente
        this.listarTipoCurso();

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
            //codAula: ['', Validators.required],
            numeroCupo: ['', Validators.required],
            fechaInicioCurso: ['', Validators.required],
            fechaFinCurso: ['', Validators.required],
            fechaInicioCargaNota: ['', Validators.required],
            fechaFinCargaNota: ['', Validators.required],
            notaMinima: ['', Validators.required],
            //apruebaCreacionCurso: ['', Validators.required],
            //codCatalogoCursos: ['', Validators.required],
            //estado: ['', Validators.required],
            emailNotificacion: ['', Validators.required],
            tieneModulos: ['', Validators.required],
            porcentajeAceptacionCurso: ['', Validators.required],
            //codUsuarioCreacion: ['', Validators.required],
            //codUsuarioValidacion: ['', Validators.required],
            nombre: ['', Validators.required]
        });
    }

    // getters form curso
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
            fechaInicioCurso: new Date(),
            fechaFinCurso: null,
            fechaInicioCargaNota: new Date(),
            fechaFinCargaNota: null,
            notaMinima: 0,
            apruebaCreacionCurso: false,
            codCatalogoCursos: this.catalogoCursoSeleccionado.codCatalogoCursos,
            estado: 'ACTIVO',
            emailNotificacion: null,
            tieneModulos: false,
            porcentajeAceptacionCurso: 0,
            codUsuarioCreacion: this.usuarioActual.codUsuario,
            codUsuarioValidacion: null,
            nombre: 'Nombre del curso'
        };
    }


}
