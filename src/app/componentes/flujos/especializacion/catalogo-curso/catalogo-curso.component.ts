import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { AlertaComponent } from 'src/app/componentes/util/alerta/alerta.component';
import { Menu } from 'src/app/modelo/admin/menu';
import { CatalogoCurso } from 'src/app/modelo/flujos/especializacion/catalogo-curso';
import { Curso } from 'src/app/modelo/flujos/especializacion/curso';
import { TipoCurso } from 'src/app/modelo/flujos/especializacion/tipo-curso';
import { CatalogoCursoService } from 'src/app/servicios/especializacion/catalogo-curso.service';
import { CursoService } from 'src/app/servicios/especializacion/curso.service';
import { TipoCursoService } from 'src/app/servicios/especializacion/tipo-curso.service';
import { ComponenteBase } from 'src/app/util/componente-base';
import { Notificacion } from 'src/app/util/notificacion';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-catalogo-curso',
  templateUrl: './catalogo-curso.component.html',
  styleUrls: ['./catalogo-curso.component.scss'],
})
export class CatalogoCursoComponent extends ComponenteBase implements OnInit {
  tipos: TipoCurso[] = [];
  catalogos: CatalogoCurso[] = [];

  tipoCursoSeleccionado: TipoCurso = null;
  catalogoCursoSeleccionado: CatalogoCurso = null;

  tipoCurso: TipoCurso = new TipoCurso();
  tipoCursoEditForm: TipoCurso = new TipoCurso();

  catalogoCurso: CatalogoCurso = new CatalogoCurso();
  catalogoCursoEditForm: CatalogoCurso = new CatalogoCurso();

  selectedRow: any;

  // codigo de item a modificar o eliminar
  codigoTipoCurso: number;
  codigoCatalogoCurso: number;
  showLoading = false;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  validacionUtil = ValidacionUtil;

  @ViewChild('table') table!: MdbTableDirective<Menu>;
  editElementIndexN1 = -1;
  editElementIndexN2 = -1;

  // variables para agregar filas
  addRowN1 = false;
  addRowN2 = false;

  headersMenuN1 = ['Nombre'];
  headersMenuN2 = [...this.headersMenuN1, 'Descripción'];

  headersMapN1 = [
    { name: 'Nombre', value: 'Nombre' },
  ];
  headersMapN2 = [
    ...this.headersMapN1,
    {
      name: 'descripcion',
      value: 'Descripción',
    },
  ];

  nivelEliminar: number;

  constructor(
    private tipoCursoService: TipoCursoService,
    private catalogoCursoService: CatalogoCursoService,
    private cursoService: CursoService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.tipoCursoService.get().subscribe((data: TipoCurso[]) => {
        this.tipos = data;
      })
    );
  }

  // nivel 2 para hijos de menú nivel 1
  // nivel 3 para hijos de menú nivel 2
  public listarCatalogos(codTipoCurso: number): void {
    this.subscriptions.push(
      this.catalogoCursoService.getPorTipoCurso(codTipoCurso).subscribe((data: CatalogoCurso[]) => {
        this.catalogos = data;
      })
    );
  }

  initTipoCurso(): TipoCurso {
    let tipoCurso = new TipoCurso();
    tipoCurso.codTipoCurso = null;
    tipoCurso.nombreTipoCurso = '';
    tipoCurso.estado = 'ACTIVO';
    return tipoCurso;
  }

  initCatalogoCurso(): CatalogoCurso {
    let catalogoCurso = new CatalogoCurso();
    catalogoCurso.codCatalogoCursos = null;
    catalogoCurso.nombreCatalogoCurso = '';
    catalogoCurso.descripcionCatalogoCurso = '';
    catalogoCurso.estado = 'ACTIVO';
    return catalogoCurso;
  }

  //registro tipo curso
  public registroTipoCurso(tipoCurso: TipoCurso): void {
    console.log(tipoCurso);
    this.showLoading = true;

    tipoCurso = { ...tipoCurso, estado: 'ACTIVO' };

    // primero validar campos obligatorios
    if (ValidacionUtil.isNullOrEmpty(tipoCurso.nombreTipoCurso)) {
      this.showLoading = false;
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    this.subscriptions.push(
      this.tipoCursoService.crear(tipoCurso).subscribe({
        next: (response: HttpResponse<TipoCurso>) => {
          // guardar en array el nuevo objeto
          let nuevoTipoCurso: TipoCurso = response.body;

          // actualiza el array correspondiente
          this.tipos.push(nuevoTipoCurso);
          this.tipos = [...this.tipos];
          this.addRowN1 = false;

          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Tipo Curso creado con éxito'
          );

          this.tipoCurso = this.initTipoCurso();
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
        },
      })
    );
  }

  //registro catalogo curso
  public registroCatalogoCurso(catalogoCurso: CatalogoCurso): void {
    this.showLoading = true;

    catalogoCurso = { 
      ...catalogoCurso,  
      codTipoCurso: this.tipoCursoSeleccionado.codTipoCurso,
      estado: 'ACTIVO'
    };

    // primero validar campos obligatorios
    if (ValidacionUtil.isNullOrEmpty(catalogoCurso.nombreCatalogoCurso)) {
      this.showLoading = false;
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    if (ValidacionUtil.isNullOrEmpty(catalogoCurso.descripcionCatalogoCurso)) {
      this.showLoading = false;
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    this.subscriptions.push(
      this.catalogoCursoService.crear(catalogoCurso).subscribe({
        next: (response: HttpResponse<CatalogoCurso>) => {
          // guardar en array el nuevo objeto
          let nuevoCatalogoCurso: CatalogoCurso = response.body;

          // actualiza el array correspondiente
          this.catalogos.push(nuevoCatalogoCurso);
          this.catalogos = [...this.catalogos];
          this.addRowN2 = false;

          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Catálogo Curso creado con éxito'
          );

          this.catalogoCurso = this.initCatalogoCurso();
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
        },
      })
    );
  }

  // editar tipo curso
  public editarTipoCurso(index: number) {
      this.editElementIndexN1 = index;
      this.tipoCursoEditForm = { ...this.tipos[index] };
  }

  public actualizarTipoCurso(tipoCurso: TipoCurso, formValue): void {
    this.showLoading = true;

    // prepara el objeto a actualizar
    tipoCurso = {
      ...tipoCurso,
      nombreTipoCurso: formValue.nombreTipoCurso,
    };

    // validación vacíos
    // se requiere validar por nivel de menú

    // primero validar campos obligatorios en todos los niveles
    if (ValidacionUtil.isNullOrEmpty(tipoCurso.nombreTipoCurso)) {
      this.showLoading = false;
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    // actualiza el objeto en la base de datos
    this.subscriptions.push(
      this.tipoCursoService.actualizar(tipoCurso).subscribe({
        next: (response: HttpResponse<TipoCurso>) => {
          // actualiza el objeto en el array correspondiente
          this.tipos[this.editElementIndexN1] = response.body;
          this.tipos = [...this.tipos];

          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Tipo Curso actualizado con éxito'
          );

          // reestablece índices
          this.editElementIndexN1 = -1;
          this.editElementIndexN2 = -1;

          //reestablece objetos temporales
          this.reestableceObjetosTipoCurso();
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
        },
      })
    );
  }

  // editar catalogo curso
  public editarCatalogoCurso(index: number) {
    this.editElementIndexN2 = index;
    this.catalogoCursoEditForm = { ...this.catalogos[index] };
  }

  public actualizarCatalogoCurso(catalogoCurso: CatalogoCurso, formValue): void {
    this.showLoading = true;

    // prepara el objeto a actualizar
    catalogoCurso = {
      ...catalogoCurso,
      nombreCatalogoCurso: formValue.nombreCatalogoCurso,
      descripcionCatalogoCurso: formValue.descripcionCatalogoCurso
    };

    // validación vacíos
    // se requiere validar por nivel de menú

    // primero validar campos obligatorios en todos los niveles
    if (ValidacionUtil.isNullOrEmpty(catalogoCurso.nombreCatalogoCurso)) {
      this.showLoading = false;
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    if (ValidacionUtil.isNullOrEmpty(catalogoCurso.descripcionCatalogoCurso)) {
      this.showLoading = false;
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    // actualiza el objeto en la base de datos
    this.subscriptions.push(
      this.catalogoCursoService.actualizar(catalogoCurso).subscribe({
        next: (response: HttpResponse<CatalogoCurso>) => {
          // actualiza el objeto en el array correspondiente
          this.catalogos[this.editElementIndexN2] = response.body;
          this.catalogos = [...this.catalogos];

          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Catálogo Curso actualizado con éxito'
          );

          // reestablece índices
          this.editElementIndexN1 = -1;
          this.editElementIndexN2 = -1;

          //reestablece objetos temporales
          this.reestableceObjetosCatalogoCurso();
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
        },
      })
    );
  }

  // eliminar tipo curso
  public confirmaEliminarTipoCurso(event: Event, codigo: number): void {
    // verifica si tiene catálogos activos
    this.subscriptions.push(
      this.catalogoCursoService.getPorTipoCurso(codigo).subscribe((data: CatalogoCurso[]) => {
        if (data.length > 0) {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            null,
            'No se puede eliminar un tipo que contiene catálogos activos'
          );
          return;
        } else {
          super.confirmaEliminarMensaje();
          this.codigoTipoCurso = codigo;
          super.openPopconfirm(event, this.eliminarTipoCurso.bind(this));
        }
      })
    );
  }

  public eliminarTipoCurso(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.tipoCursoService.eliminar(this.codigoTipoCurso).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Tipo Curso eliminado con éxito'
          );
          this.showLoading = false;

          const index = this.tipos.findIndex(
            (tipoCurso) => tipoCurso.codTipoCurso === this.codigoTipoCurso
          );
          this.tipos.splice(index, 1);
          this.tipos = [...this.tipos];

          this.reestablecerSeleccionTipoCurso();
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
        },
      })
    );
  }

  // eliminar catalogo curso
  public confirmaEliminarCatalogoCurso(event: Event, codigo: number): void {
    // verifica si tiene cursos activos
    this.subscriptions.push(
      this.cursoService.getPorCatalogoCurso(codigo).subscribe((data: Curso[]) => {
        if (data.length > 0) {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            null,
            'No se puede eliminar un catálogo que contiene cursos activos'
          );
          return;
        } else {
          super.confirmaEliminarMensaje();
          this.codigoCatalogoCurso = codigo;
          super.openPopconfirm(event, this.eliminarCatalogoCurso.bind(this));
        }
      })
    );
  }

  public eliminarCatalogoCurso(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.catalogoCursoService.eliminar(this.codigoCatalogoCurso).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Catálogo Curso eliminado con éxito'
          );
          this.showLoading = false;

          const index = this.catalogos.findIndex(
            (catalogoCurso) => catalogoCurso.codCatalogoCursos === this.codigoCatalogoCurso
          );
          this.catalogos.splice(index, 1);
          this.catalogos = [...this.catalogos];

          this.reestablecerSeleccionCatalogoCurso();
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
        },
      })
    );
  }

  // selección de tipo curso
  public onSelectRowTipoCurso(tipoCurso: TipoCurso): void {
    this.tipoCursoSeleccionado = tipoCurso;
    this.catalogoCursoSeleccionado = null;
    this.catalogos = [];

    // obtiene los catalogos
    this.obtenerCatalogos(tipoCurso.codTipoCurso);
  }

  // selección de catalogo curso
  public onSelectRowCatalogoCurso(catalogoCurso: CatalogoCurso): void {
    this.catalogoCursoSeleccionado = catalogoCurso;
  }

  obtenerCatalogos(codTipoCurso: number): void {
    this.subscriptions.push(
      this.catalogoCursoService.getPorTipoCurso(codTipoCurso).subscribe((data: CatalogoCurso[]) => {
        this.catalogos = data;
      })
    );
  }

  reestablecerSeleccionTipoCurso(): void {
    this.tipoCursoSeleccionado = null;
    this.catalogoCursoSeleccionado = null;

    this.tipoCurso = this.initTipoCurso();
    this.tipoCursoEditForm = this.initTipoCurso();
  }

  reestablecerSeleccionCatalogoCurso(): void {
    this.catalogoCursoSeleccionado = null;

    this.catalogoCurso = this.initCatalogoCurso();
    this.catalogoCursoEditForm = this.initCatalogoCurso();
  }

  agregarTipoCurso() {
    this.reestableceObjetosTipoCurso();
  }

  agregarCatalogoCurso() {
    this.reestableceObjetosCatalogoCurso();
  }
  
  reestableceObjetosTipoCurso() {
    // reestablece objetos temporales
    this.tipoCurso = this.initTipoCurso();
    this.tipoCursoEditForm = this.initTipoCurso();
  }

  reestableceObjetosCatalogoCurso() {
    // reestablece objetos temporales
    this.catalogoCurso = this.initCatalogoCurso();
    this.catalogoCursoEditForm = this.initCatalogoCurso();
  }
}
