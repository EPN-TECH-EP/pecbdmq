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
import { ComponenteBase } from 'src/app/util/componente-base';
import { ValidacionUtil } from 'src/app/util/validacion-util';


@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss']
})
export class ModuloComponent extends ComponenteBase implements OnInit {
  //model
  Modulos: Modulo[];
  Modulo: Modulo;
  ModuloEditForm: Modulo;
  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
//  private subscriptions: Subscription[];


// codigo de item a modificar o eliminar
codigo: number;
showLoading = false;
data: Modulo;

validacionUtil = ValidacionUtil;

//options
 options = [
  { value: 'ACTIVO', label: 'ACTIVO' },
  { value: 'INACTIVO', label: 'INACTIVO' },
];
  //table
  @ViewChild('table') table!: MdbTableDirective<Modulo>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Módulo','Descripción'];

  constructor(
    private ApiModulo: ModuloService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {

    super(notificationServiceLocal, popconfirmServiceLocal);

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
      this.notificationServiceLocal,
      mensajeError,
      tipoAlerta
    );
  }

  public notificacionOk(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
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
          this.notificacionOk('Módulo creado con éxito');
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

  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  //actualizar
  public actualizar(Modulo: Modulo, formValue): void {

    if (this.ModuloEditForm.etiqueta == '' || this.ModuloEditForm.descripcion == '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    Modulo = {...Modulo, etiqueta: formValue.etiqueta, descripcion: formValue.descripcion, estado: 'ACTIVO'};
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
  public confirmaEliminar(event: Event, codigo: number, modulo: Modulo): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    this.data = modulo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

 public eliminar(/*moduloId: any, data: Modulo*/): void {
   this.showLoading = true;
   this.subscriptions.push(
     this.ApiModulo.eliminarModulo(this.codigo).subscribe({
       next: (response: string) => {
         this.notificacionOk('Módulo eliminado con éxito');
         const index = this.Modulos.indexOf(this.data);
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

  search(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

}
