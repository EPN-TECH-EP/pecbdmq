import { ComponenteNotaService } from './../../servicios/componente-nota.service';
import { ComponenteNota } from './../../modelo/componente-nota';
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
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { HeaderType } from 'src/app/enum/header-type.enum';

@Component({
  selector: 'app-componente-nota',
  templateUrl: './componente-nota.component.html',
  styleUrls: ['./componente-nota.component.scss']
})
export class ComponenteNotaComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  componentesnota: ComponenteNota[];
  public showLoading: boolean;

  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];
  constructor(
    private ApiComponenteNota: ComponenteNotaService,
    private notificationService: MdbNotificationService,
    public Valcomponentenota:ComponenteNota
  ) { }

  @ViewChild('table') table!: MdbTableDirective<ComponenteNota>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Componente Nota', 'Estado'];

  addNewRow() {
    const newRow: ComponenteNota = {
      cod_componente_nota: this.Valcomponentenota.cod_componente_nota,
      componentenota: this.Valcomponentenota.componentenota,
      estado: this.Valcomponentenota.estado,
    }
    this.componentesnota = [...this.componentesnota, { ...newRow }];
    this.Valcomponentenota.cod_componente_nota = '';
    this.Valcomponentenota.componentenota = '';
    this.Valcomponentenota.estado = 'ACTIVO';
  }
  ngOnInit(): void {
    this.Valcomponentenota.estado = 'ACTIVO';
    this.ApiComponenteNota.getComponenteNota().subscribe(data => {
      this.componentesnota = data;
      console.log(data);
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
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiComponenteNota.crearComponenteNota(componentenota).subscribe({
        next: (response: HttpResponse<ComponenteNota>) => {
          let nuevoComponenteNota: ComponenteNota = response.body;
          this.componentesnota.push(nuevoComponenteNota);
          this.notificacionOk('Componente nota creado con éxito');
          this.Valcomponentenota.componentenota = '';
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);

        },
      })
    );
  }

  //actualizar
  public actualizar(ComponenteNota: ComponenteNota, ComponenteNotaId:any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiComponenteNota.actualizarComponenteNota(ComponenteNota,ComponenteNotaId).subscribe({
      next: (response: HttpResponse<ComponenteNota>) => {
        let actualizaComponenteNota: ComponenteNota = response.body;
        this.notificacionOk('Componente nota actualizado con éxito');
        this.editElementIndex=-1;
        this.Valcomponentenota.componentenota = '';
        this.showLoading = false;
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
          const index = this.componentesnota.indexOf(data);
          this.componentesnota.splice(index, 1);
          this.componentesnota = [...this.componentesnota]
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
