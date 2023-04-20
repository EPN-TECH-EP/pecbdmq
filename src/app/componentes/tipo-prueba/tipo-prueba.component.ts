import { TipoPrueba } from '../../modelo/admin/tipo-prueba';
import { TipoPruebaService } from './../../servicios/tipo-prueba.service';
import { Component, OnInit } from '@angular/core';
import { MdbNotificationService, MdbNotificationRef } from 'mdb-angular-ui-kit/notification';
import { Subscription } from 'rxjs';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { Notificacion } from 'src/app/util/notificacion';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';




@Component({
  selector: 'app-tipo-prueba',
  templateUrl: './tipo-prueba.component.html',
  styleUrls: ['./tipo-prueba.component.scss']
})
export class TipoPruebaComponent implements OnInit {
  tiposprueba: TipoPrueba[];
  tipoPrueba: TipoPrueba;
  tipoPruebaEditForm: TipoPrueba;


  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[] = [];
  public showLoading: boolean;




  @ViewChild('table') table!: MdbTableDirective<TipoPrueba>;
  editElementIndex = -1;
  addRow = false;
  headers = ['TipoPrueba'];


  constructor(
    private Api: TipoPruebaService,
    private notificationService: MdbNotificationService) {
      this.tiposprueba=[];
      this.subscriptions =[];
      this.tipoPrueba ={
        cod_tipo_prueba:0,
        prueba:'',
        estado:'ACTIVO'
      };
      this.tipoPruebaEditForm = {
        cod_tipo_prueba:0,
        prueba:'',
        estado:'ACTIVO'
      };
    }


  ngOnInit(): void {
    this.Api.getTipoPrueba().subscribe(data => {
      this.tiposprueba = data;

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
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }
    public notificacionOK(mensaje: string) {
      this.notificationRef = Notificacion.notificar(
        this.notificationService,
        mensaje,
        TipoAlerta.ALERTA_OK
      );
  }
  public registro(tipoPrueba: TipoPrueba): void {
    tipoPrueba={...tipoPrueba, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crearTipoPrueba(tipoPrueba).subscribe({
        next: (response: HttpResponse<TipoPrueba>) => {
          let nuevaPrueba: TipoPrueba = response.body;
          this.tiposprueba.push(nuevaPrueba);
          this.notificacionOK('Prueba creada con éxito');
          this.tipoPrueba ={
            cod_tipo_prueba:0,
            prueba:'',
            estado:'ACTIVO'
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
    this.tipoPruebaEditForm = {...this.tiposprueba[index]};
  }

  undoRow() {
    this.tipoPruebaEditForm = {
      cod_tipo_prueba:0,
      prueba:'',
      estado:'ACTIVO'
    };
    this.editElementIndex = -1;
  }



  public actualizar(tipoPrueba: TipoPrueba, formValue): void {
    tipoPrueba={...tipoPrueba, prueba: formValue.prueba ,estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarTipoPrueba(tipoPrueba,tipoPrueba.cod_tipo_prueba).subscribe({
      next: (response) => {
        this.notificacionOK('Prueba actualizada con éxito');
        this.tiposprueba[this.editElementIndex] = response.body;
        this.showLoading = false;
        this.tipoPrueba ={
          cod_tipo_prueba:0,
          prueba:'',
          estado:'ACTIVO'
        }
        this.editElementIndex=-1;
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
      },
    })
  )
}


//eliminar

public eliminar(cod_tipo_prueba: number): void {
this.showLoading = true;
this.subscriptions.push(
  this.Api.eliminarTipoPrueba(cod_tipo_prueba).subscribe({
    next: () => {
      this.notificacionOK('Tipo de prueba eliminada con éxito');
      this.showLoading = false;
      const index = this.tiposprueba.findIndex(tipoPrueba => tipoPrueba.cod_tipo_prueba === cod_tipo_prueba);
      this.tiposprueba.splice(index, 1);
      this.tiposprueba = [...this.tiposprueba];
    },
    error: (errorResponse: HttpErrorResponse) => {
      this.notificacion(errorResponse);
    },
  })
)
}

}
