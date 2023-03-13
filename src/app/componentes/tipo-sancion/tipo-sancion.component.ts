import {Component, OnInit, ViewChild} from '@angular/core';
import {ITipoSancion} from "../../modelo/tipo_sancion";
import {TipoSancionService} from "../../servicios/tipo-sancion.service";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../util/alerta/alerta.component";
import {Subscription} from "rxjs";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {Notificacion} from "../../util/notificacion";
import {TipoAlerta} from "../../enum/tipo-alerta";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {CustomHttpResponse} from "../../modelo/custom-http-response";

@Component({
  selector: 'app-tipo-sancion',
  templateUrl: './tipo-sancion.component.html',
  styleUrls: ['./tipo-sancion.component.scss']
})
export class TipoSancionComponent implements OnInit {

  //model
  tiposSancion: ITipoSancion[];
  tipoSancion: ITipoSancion;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[];
  public showLoading: boolean;

  //options
  options = [
    {value: 'ACTIVO', label: 'ACTIVO'},
    {value: 'INACTIVO', label: 'INACTIVO'},
  ];

  //table
  @ViewChild('table') table!: MdbTableDirective<ITipoSancion>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Sanción'];

  constructor(private apiTipoSancion: TipoSancionService, private notificationService: MdbNotificationService) {
    this.tiposSancion = [];
    this.subscriptions = [];
    this.tipoSancion = {
      cod_tipo_sancion: 0,
      sancion: '',
      estado: 'ACTIVO'
    }
  }

  ngOnInit(): void {
    this.apiTipoSancion.getTiposSancion().subscribe(data => {
      this.tiposSancion = data;
    });
  }

  public okNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  private errorResponseNotification(errorResponse: HttpErrorResponse) {
    let customError: CustomHttpResponse = errorResponse.error;
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_ERROR;
    let messageError = customError.mensaje

    if (!messageError) {
      messageError = 'Error inesperado';
      tipoAlerta = TipoAlerta.ALERTA_ERROR
    }

    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      messageError,
      tipoAlerta
    )
  }

  //create a register of tipo sancion
  public createTipoSancion(tipoSancion: ITipoSancion): void {
    tipoSancion = {...tipoSancion, estado:'ACTIVO'}
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoSancion.createTipoSancion(tipoSancion).subscribe({
        next: (response: HttpResponse<ITipoSancion>) => {
          let newTipoSancion: ITipoSancion = response.body;
          this.tiposSancion.push(newTipoSancion);
          this.okNotification('Tipo de sanción creado correctamente');
          this.showLoading = false;
          this.tipoSancion = {
            cod_tipo_sancion: 0,
            estado: 'ACTIVO',
            sancion: ''
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseNotification(errorResponse);
        },
      })
    )
  }

  //update a register of tipo sancion
  public updateTipoSancion(tipoSancion: ITipoSancion): void {
    tipoSancion = {...tipoSancion, estado: "ACTIVO"}
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoSancion.updateTipoSancion(tipoSancion, tipoSancion.cod_tipo_sancion).subscribe({
        next: () => {
          this.okNotification('Tipo de sanción actualizado correctamente');
          this.editElementIndex = -1;
          this.showLoading = false;
          this.tipoSancion = {
            cod_tipo_sancion: 0,
            estado: 'ACTIVO',
            sancion: ''
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseNotification(errorResponse);
        },
      })
    )
  }

  //delete a register of tipo sancion
  public deleteTipoSancion(cod_tipo_sancion: number): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoSancion.deleteTipoSancion(cod_tipo_sancion).subscribe({
        next: () => {
          this.okNotification('Tipo de sanción eliminado correctamente');
          this.showLoading = false;
          const index = this.tiposSancion.findIndex(tipoSancion => tipoSancion.cod_tipo_sancion === cod_tipo_sancion);
          this.tiposSancion.splice(index, 1);
          this.tiposSancion = [...this.tiposSancion];
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseNotification(errorResponse);
        },
      })
    )
  }

}
