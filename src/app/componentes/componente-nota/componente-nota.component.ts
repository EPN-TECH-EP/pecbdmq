import { ComponenteNotaService } from './../../servicios/componente-nota.service';
import { ComponenteNota } from '../../modelo/admin/componente-nota';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-componente-nota',
  templateUrl: './componente-nota.component.html',
  styleUrls: ['./componente-nota.component.scss']
})
export class ComponenteNotaComponent implements OnInit {
   //model
   componentesNota: ComponenteNota[];
   componenteNota: ComponenteNota;
   componenteNotaEditForm: ComponenteNota;
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
  @ViewChild('table') table!: MdbTableDirective<ComponenteNota>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Componente Nota'];

  constructor(
    private ApiComponenteNota: ComponenteNotaService,
    private notificationService: MdbNotificationService,
  ) {
    this.componentesNota = [];
    this.subscriptions = [];
    this.componenteNota = {
      cod_componente_nota: 0,
      componentenota: '',
      estado: 'ACTIVO'
    }
    this.componenteNotaEditForm = {
      cod_componente_nota: 0,
      componentenota: '',
      estado: 'ACTIVO'
    };
   }


  ngOnInit(): void {
    this.ApiComponenteNota.getComponenteNota().subscribe(data => {
      this.componentesNota = data;
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
  public registro(componentenota: ComponenteNota): void {
    componentenota={...componentenota, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiComponenteNota.crearComponenteNota(componentenota).subscribe({
        next: (response: HttpResponse<ComponenteNota>) => {
          let nuevoComponenteNota: ComponenteNota = response.body;
          this.componentesNota.push(nuevoComponenteNota);
          this.notificacionOk('Componente nota creado con éxito');
          this.componenteNota = {
            cod_componente_nota: 0,
            componentenota: '',
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
    this.componenteNotaEditForm = {...this.componentesNota[index]};
  }

  undoRow() {
    this.componenteNotaEditForm = {
      cod_componente_nota: 0,
      componentenota: '',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }
  //actualizar
  public actualizar(componenteNota: ComponenteNota, formValue): void {
    componenteNota={...componenteNota, componentenota:formValue.componentenota, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiComponenteNota.actualizarComponenteNota(componenteNota, componenteNota.cod_componente_nota).subscribe({
      next: (response: HttpResponse<ComponenteNota>) => {
        this.notificacionOk('Componente nota actualizado con éxito');
        this.componentesNota[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.componenteNota = {
            cod_componente_nota: 0,
            componentenota: '',
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

  public eliminar(ComponenteNotaId: any, data: ComponenteNota): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiComponenteNota.eliminarComponenteNota(ComponenteNotaId).subscribe({
        next: (response: string) => {
          this.notificacionOk('Componente nota eliminado con éxito');
          const index = this.componentesNota.indexOf(data);
          this.componentesNota.splice(index, 1);
          this.componentesNota = [...this.componentesNota]
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
