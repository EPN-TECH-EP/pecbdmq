import { Modulo } from 'src/app/modelo/admin/modulo';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { Component, OnInit, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { Subscription } from 'rxjs';
import { MdbNotificationRef, MdbNotificationService, } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Notificacion } from 'src/app/util/notificacion';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';


import { HeaderType } from 'src/app/enum/header-type.enum';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { FormArray, FormControl } from '@angular/forms';
import { ModuloEstados } from 'src/app/modelo/admin/modulo-estados';
import { CatalogoEstados } from 'src/app/modelo/admin/catalogo-estados';
import { ModuloEstadosService } from 'src/app/servicios/modulo-estados.service';
import { CatalogoEstadosService } from 'src/app/servicios/catalogo-estados.service';
import { ComponenteBase } from 'src/app/util/componente-base';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-modulo-estados',
  templateUrl: './modulo-estados.component.html',
  styleUrls: ['./modulo-estados.component.scss']
})
export class ModuloEstadosComponent extends ComponenteBase implements OnInit {
  modulosEstados: ModuloEstados[];
  modulos: Modulo[];
  estadosCatalogo: CatalogoEstados[];
  moduloEstados: ModuloEstados;
  moduloEstadosEditForm: ModuloEstados;


  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[] = [];
  public userResponse: string;

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  @ViewChild('table') table!: MdbTableDirective<ModuloEstados>;
  editElementIndex = -1;
  addRow = false;

  validacionUtil = ValidacionUtil;

  headers = [
    'Modulo',
    'Catálogo Estados',
    'Orden'
  ];


  constructor(
    private Api: ModuloEstadosService,
    private ApiModulo: ModuloService,
    private ApiEstadosCatalogo: CatalogoEstadosService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,

  ) {

    super(notificationServiceLocal, popconfirmServiceLocal);

    this.modulosEstados = [];
    this.subscriptions = [];
    this.moduloEstados = {
      codigo: 0,
      estadoCatalogo:'',
      orden:''as any,
      modulo:'',
      estado:'ACTIVO'

    }
    this.moduloEstadosEditForm = {
      codigo: 0,
      estadoCatalogo:'',
      orden:''as any,
      modulo:'',
      estado:'ACTIVO'

    }
  }

  ngOnInit(): void {
    this.Api.getModuloEstados().subscribe(data => {
      this.modulosEstados = data;
    });
    this.ApiModulo.getModulo().subscribe(data => {
      this.modulos = data;
    });
    this.ApiEstadosCatalogo.getCatalogo().subscribe(data => {
      this.estadosCatalogo = data;
    });
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

/*
  private notificacion(errorResponse: HttpErrorResponse) {

    let customError: CustomHttpResponse = errorResponse.error;
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;

    let mensajeError = customError.mensaje;
    let codigoError = errorResponse.status;

    if (!mensajeError) {
      mensajeError = 'Error inesperado';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }



    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensajeError,
      tipoAlerta
    );
  }


  public notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }
  */
  //registro
  public registro(moduloEstados: ModuloEstados): void {

    moduloEstados = { ...moduloEstados,  estado: 'ACTIVO' };
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.registroModuloEstados(moduloEstados).subscribe({
        next: (response: HttpResponse<ModuloEstados>) => {
          let nuevoModulo: ModuloEstados = response.body;
          //this.table.data.push(nuevoModulo);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Modulo de Estados creada con éxito');

          this.Api.getModuloEstados().subscribe(data => {
            this.modulosEstados = data;
          });
          this.moduloEstados = {
            codigo: 0,
            estadoCatalogo:'',
            orden:''as any,
            modulo:'',
            estado:'ACTIVO'

          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    );
  }

  editRow(index: number) {

    this.editElementIndex = index;
    this.moduloEstadosEditForm = {...this.modulosEstados[index]};

    console.log(this.moduloEstadosEditForm);

  }

  undoRow() {
    this.moduloEstadosEditForm = {
      codigo: 0,
      estadoCatalogo:'',
      orden:'' as any,
      modulo:'',
      estado:'ACTIVO'
    };
    this.editElementIndex = -1;
  }



  //actualizar
  public actualizar(moduloEstados: ModuloEstados, formValue): void {

    moduloEstados={ ...moduloEstados,
      modulo: formValue.modulo,
      estadoCatalogo: formValue.estadoCatalogo,
      orden: formValue.orden,
      estado: 'ACTIVO' }
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarModuloEstados(moduloEstados, moduloEstados.codigo).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Modulo de Estados actualizada con éxito');

          this.modulosEstados[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.Api.getModuloEstados().subscribe(data => {
            this.modulosEstados = data;
          });
          this.editElementIndex=-1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    );
  }

// eliminar
public confirmaEliminar(event: Event, codigo: number): void {
  super.confirmaEliminarMensaje();
  this.codigo = codigo;
  super.openPopconfirm(event, this.eliminar.bind(this));
}

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminarModuloEstados(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Modulo de Estados eliminada con éxito');

          this.showLoading = false;
          const index = this.modulosEstados.findIndex(moduloEstados => moduloEstados.codigo === this.codigo);
          this.modulosEstados.splice(index, 1);
          this.modulosEstados = [...this.modulosEstados]
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          console.log(errorResponse);
        },
      })
    );
  }
}
