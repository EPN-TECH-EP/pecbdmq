 import { CatalogoEstadosService } from './../../servicios/catalogo-estados.service';
 import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
 import { Component, OnInit, ViewChild } from '@angular/core';
 import { MdbNotificationRef, MdbNotificationService } from 'mdb-angular-ui-kit/notification';
 import { Subscription } from 'rxjs';
 import { TipoAlerta } from 'src/app/enum/tipo-alerta';
 import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';
 import { Notificacion } from 'src/app/util/notificacion';
 import { AlertaComponent } from '../util/alerta/alerta.component';
 import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
 import { CatalogoEstados } from 'src/app/modelo/admin/catalogo-estados';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { ComponenteBase } from 'src/app/util/componente-base';

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
   //private subscriptions: Subscription[] = [];
   //public showLoading: boolean;
   public userResponse: string;


   @ViewChild('table') table!: MdbTableDirective<CatalogoEstados>;
   editElementIndex = -1;
   addRow = false;
   headers = ['Nombre del Catálogo'];


   constructor(
     private Api: CatalogoEstadosService,
     private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
   ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
     this.catalogos= [];
     this.subscriptions = [];
     this.catalogo = {
       codigo:0,
       nombre:'',
       estado:'ACTIVO'
     }
     this.catalogoEditForm = {
       codigo: 0,
       nombre:'',
       estado:'ACTIVO'
     };
   }

   ngOnInit(): void {
     this.Api.getCatalogo().subscribe(data => {
       this.catalogos = data;
       console.log(data);
     })
   }

   search(event: Event): void {
     const searchTerm = (event.target as HTMLInputElement).value;
     this.table.search(searchTerm);
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


   public notificacionOK(mensaje: string) {
     this.notificationRef = Notificacion.notificar(
       this.notificationServiceLocal,
       mensaje,
       TipoAlerta.ALERTA_OK
     );
   }


   public errorNotification(mensaje: string) {
     this.notificationRef = Notificacion.notificar(
       this.notificationService,
       mensaje,
       TipoAlerta.ALERTA_ERROR
     );
   }

   //registro
   public registro(catalogo: CatalogoEstados): void {
     catalogo={...catalogo, estado:'ACTIVO'};
     this.showLoading = true;
     this.subscriptions.push(
       this.Api.crearCatalogo(catalogo).subscribe({
         next: (response: HttpResponse<CatalogoEstados>) => {
           let nuevoCatalogo: CatalogoEstados = response.body;
           this.catalogos.push(nuevoCatalogo);
           this.notificacionOK('Catálogo de Estado creado con éxito');
             this.Api.getCatalogo().subscribe(data => {
              this.catalogos = data;
            });
           this.catalogo ={
           codigo: 0,
           nombre:'',
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
     this.catalogoEditForm = {...this.catalogos[index]};
   }

   undoRow() {
     this.catalogoEditForm = {
       codigo: 0,
       nombre:'',
       estado: 'ACTIVO'
     };
     this.editElementIndex = -1;
   }



   //actualizar
   public actualizar(catalogo: CatalogoEstados, formValue): void {

     catalogo={...catalogo, nombre: formValue.nombre,
      estado:'ACTIVO'}
     this.showLoading = true;
     this.subscriptions.push(
       this.Api.actualizarCatalogo(catalogo, catalogo.codigo).subscribe({
       next: (response) => {
         this.notificacionOK('Catálogo de Estados actualizada con éxito');
         this.catalogos[this.editElementIndex] = response.body;
         this.showLoading = false;
         this.catalogo ={
           codigo: 0,
           nombre:'',
           estado: 'ACTIVO'
           }
         this.editElementIndex=-1;
       },
       error: (errorResponse: HttpErrorResponse) => {
         this.notificacion(errorResponse);
       },
     })
     );
   }


   //eliminar
   public confirmaEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

 public eliminar(): void {
   this.showLoading = true;
   this.subscriptions.push(
     this.Api.eliminarCatalogo(this.codigo).subscribe({
       next: () => {
         this.notificacionOK('El catálogo de estado se ha eliminado con éxito');
         this.showLoading = false;
         const index = this.catalogos.findIndex(catalogo => catalogo.codigo === this.codigo);
         this.catalogos.splice(index, 1);
         this.catalogos = [...this.catalogos]
       },
       error: (errorResponse: HttpErrorResponse) => {
         this.notificacion(errorResponse);
       },
     })
   );
 }
 }
