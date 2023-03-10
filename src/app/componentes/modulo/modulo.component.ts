import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { Modulo } from 'src/app/modelo/modulo';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { Subscription } from 'rxjs';
import { MdbNotificationRef, MdbNotificationService, } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Notificacion } from 'src/app/util/notificacion';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { HeaderType } from 'src/app/enum/header-type.enum';


@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss']
})
export class ModuloComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  modulos: Modulo[];
  public showLoading: boolean;

  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];

  constructor(
    // public unidadEnviar:UnidadGestion,
    private ApiModulo: ModuloService,
    private notificationService: MdbNotificationService,
    public Valmodulo:Modulo
  ) { }

  @ViewChild('table') table!: MdbTableDirective<Modulo>;
  editElementIndex = -1;
  addRow = false;
  // CodModulo = '';
  // Etiqueta = '';
  // Descripcion = '';
  // Estado ='';
  headers = ['Etiqueta','Descripción', 'Estado'];

  addNewRow() {
    const newRow: Modulo = {
      cod_modulo: this.Valmodulo.cod_modulo,
      etiqueta: this.Valmodulo.etiqueta,
      descripcion: this.Valmodulo.descripcion,
      estado: this.Valmodulo.estado,
    }
    this.modulos = [...this.modulos, { ...newRow }];
    this.Valmodulo.cod_modulo = '';
    this.Valmodulo.etiqueta = '';
    this.Valmodulo.descripcion = '';
    this.Valmodulo.estado ='';
  }


  ngOnInit(): void {
    this.Valmodulo.estado = 'ACTIVO';
    this.ApiModulo.getModulo().subscribe(data => {
      this.modulos = data;
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
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiModulo.crearModulo(modulo).subscribe({
        next: (response: HttpResponse<Modulo>) => {
          let nuevoModulo: Modulo = response.body;
          this.modulos.push(nuevoModulo);
          this.notificacionOk('Modulo creado con éxito');
          this.Valmodulo.etiqueta = '';
          this.Valmodulo.descripcion = '';
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }

  //actualizar
  public actualizar(modulo: Modulo, moduloId:any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiModulo.actualizarModulo(modulo,moduloId).subscribe({
      next: (response: HttpResponse<Modulo>) => {
        let actualizaModulo: Modulo = response.body;
        this.notificacionOk('Módulo actualizado con éxito');
        this.editElementIndex=-1;
        this.showLoading = false;
        this.Valmodulo.etiqueta = '';
        this.Valmodulo.descripcion = '';
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
         const index = this.modulos.indexOf(data);
         this.modulos.splice(index, 1);
         this.modulos = [...this.modulos];
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
