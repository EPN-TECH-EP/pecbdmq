import {CatalogoEstadosService} from '../../servicios/catalogo-estados.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {Notificacion} from 'src/app/util/notificacion';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {CatalogoEstados} from 'src/app/modelo/admin/catalogo-estados';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ComponenteBase} from 'src/app/util/componente-base';
import {ValidacionUtil} from 'src/app/util/validacion-util';

@Component({
  selector: 'app-catalogo-estados',
  templateUrl: './catalogo-estados.component.html',
  styleUrls: ['./catalogo-estados.component.scss']
})
export class CatalogoEstadosComponent extends ComponenteBase implements OnInit {
  catalogos: CatalogoEstados[];
  catalogo: CatalogoEstados;
  catalogoEditForm: CatalogoEstados;

  // codigo de item a modificar o eliminar
  codigo: number;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  validacionUtil = ValidacionUtil;


  @ViewChild('table') table!: MdbTableDirective<CatalogoEstados>;
  addRow = false;
  headers = ['Nombre del Catálogo'];
  //refactor
  estaEditando = false;
  codigoCatalogoEditando = 0;

  constructor(
    private catalogoEstadosService: CatalogoEstadosService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);
    this.catalogos = [];
    this.subscriptions = [];
    this.catalogo = {
      codigo: 0,
      nombre: '',
      estado: 'ACTIVO'
    }
    this.catalogoEditForm = {
      codigo: 0,
      nombre: '',
      estado: 'ACTIVO'
    };
  }

  ngOnInit(): void {
    this.catalogoEstadosService.getCatalogo().subscribe(data => {
      this.catalogos = data;
    })
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }
  
  editRow(catalogo: CatalogoEstados) {
    const index = this.catalogos.findIndex((value: CatalogoEstados) => value.codigo === catalogo.codigo);
    this.catalogoEditForm = {...this.catalogos[index]};
    this.codigoCatalogoEditando = this.catalogoEditForm.codigo;
  }

  undoRow() {
    this.estaEditando = false;
    this.catalogoEditForm = {codigo: 0, nombre: '', estado: 'ACTIVO'};
  }

  confirmarEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  crear(catalogo: CatalogoEstados): void {
    if (catalogo.nombre == null || catalogo.nombre == '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Ingrese el nombre del catálogo');
      return;
    }

    catalogo = {...catalogo, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.catalogoEstadosService.crearCatalogo(catalogo).subscribe({
        next: (response: HttpResponse<CatalogoEstados>) => {
          let nuevoCatalogo: CatalogoEstados = response.body;
          this.catalogos.push(nuevoCatalogo);
          this.catalogos = [...this.catalogos]
           Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Catálogo de Estado creado con éxito');

          this.catalogoEstadosService.getCatalogo().subscribe(data => {
            this.catalogos = data;
          });
          this.catalogo = {
            codigo: 0,
            nombre: '',
            estado: 'ACTIVO'
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);

        },
      })
    );
  }

  actualizar(catalogo: CatalogoEstados): void {

    if (this.catalogoEditForm.nombre == null || this.catalogoEditForm.nombre == '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Ingrese el nombre del catálogo');
      return;
    }

    catalogo = {
      ...catalogo, nombre: this.catalogoEditForm.nombre,
      estado: 'ACTIVO'
    }
    this.showLoading = true;

    this.subscriptions.push(
      this.catalogoEstadosService.actualizarCatalogo(catalogo, catalogo.codigo).subscribe({
        next: () => {
          let index = this.catalogos.findIndex((value: CatalogoEstados) => value.codigo === catalogo.codigo);
          this.catalogos[index] = catalogo;
          this.catalogos = [...this.catalogos];
          this.codigoCatalogoEditando = 0;
          this.estaEditando = false;
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Catálogo de Estado actualizado con éxito');
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.catalogoEstadosService.eliminarCatalogo(this.codigo).subscribe({
        next: () => {

          this.showLoading = false;
          const index = this.catalogos.findIndex(catalogo => catalogo.codigo === this.codigo);
          this.catalogos.splice(index, 1);
          this.catalogos = [...this.catalogos]
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'El catálogo de estado se ha eliminado con éxito');
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }
}
