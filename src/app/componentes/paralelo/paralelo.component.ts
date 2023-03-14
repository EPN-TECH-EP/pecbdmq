import {ParaleloService} from "../../servicios/paralelo.service";
import {Paralelo} from "../../modelo/paralelo/paralelo";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Component, OnInit, OnDestroy} from '@angular/core';
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {Subscription} from "rxjs";
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';

import {Notificacion} from "../../util/notificacion";
import { ViewChild } from '@angular/core';
import {MdbTableDirective} from "mdb-angular-ui-kit/table";

import {AlertaComponent} from "../util/alerta/alerta.component";

@Component({
  selector: 'app-paralelo',
  templateUrl: './paralelo.component.html',
  styleUrls: ['./paralelo.component.scss']
})
export class ParaleloComponent implements OnInit {
  paralelos: Paralelo[];
  paralelo: Paralelo;
  paraleloEdit:Paralelo;

  notificationRef: MdbNotificationRef<AlertaComponent> | null;
  private subscriptions: Subscription[];
  public showLoading: boolean;
  /*
  options = [
    {value: 'ACTIVO', label: 'ACTIVO'},
    {value: 'INACTIVO', label: 'INACTIVO'},
  ];
*/
  @ViewChild('table') table!: MdbTableDirective<Paralelo>;
  editElementIndex = -1;
  addRow = false;
  headers = [
    // 'Codigo Materia',
    'Nombre Paralelo',
    //'Estado',
  ];


  constructor(
    private notificationService: MdbNotificationService,
    private Api: ParaleloService
  ) {
    this.paralelos=[];
    this.subscriptions = [];
    this.notificationRef=null;
    this.paralelo={
      codParalelo:'',
      nombreParalelo:'',
      estado:'ACTIVO'
    }
    this.paraleloEdit={
      codParalelo:'',
      nombreParalelo:'',
      estado:'ACTIVO'
    }
  }
  ngOnInit(): void {
    this.Api.getParalelos().subscribe(data => {
      this.paralelos = data;
    });
  }
  addNewRow() {
    const newRow: Paralelo = this.paralelo;
    this.paralelos=[...this.paralelos,{...newRow}]
    this.paralelo={
      codParalelo:'',
      nombreParalelo:'',
      estado:'',
    }

  }

  public notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
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

    if (codigoError === 0) {
      mensajeError = 'Error de conexión al servidor';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    )
  }

  public registro(paralelo: Paralelo): void {
    paralelo={...paralelo,estado:'ACTIVO'}
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.registroParalelo(paralelo).subscribe({
        next: (response: HttpResponse<Paralelo>) => {
          let nuevoParalelo: Paralelo = response.body;
          this.table.data.push(nuevoParalelo);
          this.notificacionOK('Paralelo creado con éxito');
          this.showLoading = false;
          this.paralelo={
            codParalelo:'',
            nombreParalelo:'',
            estado:'',
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          //  this.showLoading = false;
        },
      })
    );
  }
  editRow(index: number) {
    this.editElementIndex = index;
    this.paraleloEdit = {...this.paralelos[index]};
  }

  undoRow() {
    this.paraleloEdit = {
      codParalelo:'',
      nombreParalelo:'',
      estado:'ACTIVO'
    };
    this.editElementIndex = -1;
  }
  public actualizar(paralelo: Paralelo,formValue): void {
    paralelo={...paralelo,estado:'ACTIVO',nombreParalelo:formValue.nombreParalelo};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarParalelo(paralelo, paralelo.codParalelo).subscribe({
        next: (response) => {
          this.notificacionOK('Paralelo actualizado con éxito');
          this.paralelos[this.editElementIndex]=response.body;
          this.editElementIndex = -1;
          this.showLoading = false;
          this.paralelo = {
            codParalelo: '',
            nombreParalelo: '',
            estado: '',
          }
        },

          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
            // this.showLoading = false;
          },
        }
      )
    );
  }

  public eliminar(codParalelo: any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminarParalelo(codParalelo).subscribe({
        next: (response: string) => {
          this.notificacionOK('Paralelo eliminado con éxito');
          this.showLoading = false;
          const index = this.paralelos.findIndex(paraleloO => paraleloO.codParalelo === codParalelo);
          this.paralelos.splice(index, 1);
          this.paralelos = [...this.paralelos];
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}





















