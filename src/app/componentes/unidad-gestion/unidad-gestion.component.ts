import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { UnidadGestion } from 'src/app/modelo/unidad_gestion';
import { UnidadGestionService } from 'src/app/servicios/unidad-gestion.service';
import { Subscription } from 'rxjs';
import { MdbNotificationRef, MdbNotificationService, } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Notificacion } from 'src/app/util/notificacion';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { HeaderType } from 'src/app/enum/header-type.enum';

@Component({
  selector: 'app-unidad-gestion',
  templateUrl: './unidad-gestion.component.html',
  styleUrls: ['./unidad-gestion.component.scss']
})
export class UnidadGestionComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  unidades: UnidadGestion[];
  public showLoading: boolean;


  constructor(
    // public unidadEnviar:UnidadGestion,
    private ApiUnidad: UnidadGestionService,
    private notificationService: MdbNotificationService
  ) { }

  @ViewChild('table') table!: MdbTableDirective<UnidadGestion>;
  editElementIndex = -1;
  addRow = false;
  Codigo = '';
  Nombre = '';
  headers = ['Nombre'];


  limpiar() {
    this.Nombre = '';
  }

  addNewRow() {
    const newRow: UnidadGestion = {
      codigo: this.Codigo,
      nombre: this.Nombre,
    }
    this.unidades = [...this.unidades, { ...newRow }];
    this.Codigo = '';
    this.Nombre = '';
  }

  onDeleteClick(data: UnidadGestion) {
    const index = this.unidades.indexOf(data);
    this.unidades.splice(index, 1);
    this.unidades = [...this.unidades]
  }
  ngOnInit(): void {
    this.ApiUnidad.getUnidadGestion().subscribe(data => {
      this.unidades = data;
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
  public registro(unidad: UnidadGestion): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiUnidad.crearUnidad(unidad).subscribe({
        next: (response: HttpResponse<UnidadGestion>) => {
          let nuevaUnidad: UnidadGestion = response.body;
          this.unidades.push(nuevaUnidad);
          this.notificacionOk('Unidad de gestión creada con éxito');

          // const token = response.headers.get(HeaderType.JWT_TOKEN);
          // this.aut.guardaToken(token);
          // this.autenticacionService.agregaUsuarioACache(response.body);

          // this.router.navigateByUrl('/principal');
          // this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          // this.showLoading = false;
        },
      })
    );
  }

  //actualizar
  public actualizar(unidad: UnidadGestion, unidadId:any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiUnidad.actualizarUnidad(unidad,unidadId).subscribe({
      next: (response: HttpResponse<UnidadGestion>) => {
        let actualizaUnidad: UnidadGestion = response.body;
        this.notificacionOk('Unidad de gestión actualizada con éxito');
        this.editElementIndex=-1;

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

public eliminar(unidadId: any): void {
  this.showLoading = true;
  this.subscriptions.push(
    this.ApiUnidad.eliminarUnidad(unidadId).subscribe({
      next: (response: string) => {
        this.notificacionOk('Unidad de gestión eliminada con éxito');

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
