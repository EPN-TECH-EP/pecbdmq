import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { Modulo } from 'src/app/modelo/admin/modulo';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { Subscription } from 'rxjs';
import { MdbNotificationRef, MdbNotificationService, } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Notificacion } from 'src/app/util/notificacion';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';
import { HeaderType } from 'src/app/enum/header-type.enum';


@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss']
})
export class ModuloComponent implements OnInit {
  //model
  Modulos: Modulo[];
  Modulo: Modulo;
  ModuloEditForm: Modulo;
  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[];
  public showLoading: boolean;
  //options
 options = [
  { value: 'ACTIVO', label: 'ACTIVO' },
  { value: 'INACTIVO', label: 'INACTIVO' },
];
  //table
  @ViewChild('table') table!: MdbTableDirective<Modulo>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Etiqueta','Descripción'];

  constructor(
    private ApiModulo: ModuloService,
    private notificationService: MdbNotificationService,
  ) {
    this.Modulos = [];
    this.subscriptions = [];
    this.Modulo = {
      cod_modulo: 0,
      etiqueta: '',
      descripcion:'',
      estado: 'ACTIVO'
    }
    this.ModuloEditForm = {
      cod_modulo: 0,
      etiqueta: '',
      descripcion:'',
      estado: 'ACTIVO'
    };
  }

  ngOnInit(): void {
    this.ApiModulo.getModulo().subscribe(data => {
      this.Modulos = data;
    })
  }

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
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }

  public notificacionOk(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  //registro
  public registro(modulo: Modulo): void {
    modulo={...modulo, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiModulo.crearModulo(modulo).subscribe({
        next: (response: HttpResponse<Modulo>) => {
          let nuevoModulo: Modulo = response.body;
          this.Modulos.push(nuevoModulo);
          this.notificacionOk('Modulo creado con éxito');
          this.Modulo = {
            cod_modulo: 0,
            etiqueta: '',
            descripcion:'',
            estado: 'ACTIVO'
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }
  editRow(index: number) {
    this.editElementIndex = index;
    this.ModuloEditForm = {...this.Modulos[index]};
  }

  undoRow() {
    this.ModuloEditForm = {
      cod_modulo: 0,
      etiqueta: '',
      descripcion:'',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }
  //actualizar
  public actualizar(Modulo: Modulo, formValue): void {
    Modulo={...Modulo, etiqueta: formValue.etiqueta, descripcion: formValue.descripcion, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiModulo.actualizarModulo(Modulo,Modulo.cod_modulo).subscribe({
      next: (response: HttpResponse<Modulo>) => {
        this.notificacionOk('Módulo actualizado con éxito');
        this.Modulos[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.Modulo = {
            cod_modulo: 0,
            etiqueta: '',
            descripcion:'',
            estado: 'ACTIVO'
          }
          this.editElementIndex = -1;

      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
        this.showLoading = false;
      },
    })
    );
  }

  //eliminar

 public eliminar(moduloId: any, data: Modulo): void {
   this.showLoading = true;
   this.subscriptions.push(
     this.ApiModulo.eliminarModulo(moduloId).subscribe({
       next: (response: string) => {
         this.notificacionOk('Módulo eliminado con éxito');
         const index = this.Modulos.indexOf(data);
         this.Modulos.splice(index, 1);
         this.Modulos = [...this.Modulos];
         this.showLoading = false;
       },
       error: (errorResponse: HttpErrorResponse) => {
         this.notificacion(errorResponse);
         console.log(errorResponse);
         this.showLoading = false;
       },
     })
   );
 }

}
