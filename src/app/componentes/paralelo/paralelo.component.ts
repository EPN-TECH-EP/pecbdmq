import {Component, OnInit, ViewChild} from '@angular/core';
import {Paralelo} from "../../modelo/paralelo/paralelo";
import {Subscription} from "rxjs";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../util/alerta/alerta.component";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {Materia} from "../../modelo/materias";
import {MateriaService} from "../../servicios/materia.service";
import {ParaleloService} from "../../servicios/paralelo.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {CustomHttpResponse} from "../../modelo/custom-http-response";
import {TipoAlerta} from "../../enum/tipo-alerta";
import {Notificacion} from "../../util/notificacion";

@Component({
  selector: 'app-paralelo',
  templateUrl: './paralelo.component.html',
  styleUrls: ['./paralelo.component.scss']
})
export class ParaleloComponent implements OnInit {
  paralelos: Paralelo[];

  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  public showLoading: boolean;
  options = [
    {value: 'ACTIVO', label: 'ACTIVO'},
    {value: 'INACTIVO', label: 'INACTIVO'},
  ];
  @ViewChild('table') table!: MdbTableDirective<Paralelo>;
  editElementIndex = -1;
  addRow = false;
  CodParalelo = '';
  NombreParalelo = '';
  Estado = '';
  headers = [
    // 'Codigo Materia',
    'Nombre Paralelo',
    'Estado',
  ];


  constructor(
    private notificationService: MdbNotificationService,
    private Api: ParaleloService
  ) {
  }

  limpiar() {
    this.NombreParalelo = '';
    this.Estado = '';
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  onDeleteClick(data: Paralelo) {
    const index = this.paralelos.indexOf(data);
    this.paralelos.splice(index, 1);
    this.paralelos = [...this.paralelos]
  }


  ngOnInit(): void {
    this.Api.getParalelos().subscribe(data => {
      this.paralelos = data;
    });
  }

  addNewRow() {
    const newRow: Paralelo = {
      codParalelo: this.CodParalelo,
      nombreParalelo: this.NombreParalelo,
      estado: this.Estado,
      // estadoMateria: this.EstadoMateria,
    };

    this.paralelos = [...this.paralelos, {...newRow}];
    this.CodParalelo = '';
    this.NombreParalelo = '';
    this.Estado = ";"

  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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

  public notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  public registro(paralelo: Paralelo): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.registroParalelo(paralelo).subscribe({
        next: (response: HttpResponse<Paralelo>) => {
          let nuevoParalelo: Paralelo = response.body;
          this.table.data.push(nuevoParalelo);
          this.notificacionOK('Materia creada con éxito');
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          //  this.showLoading = false;
        },
      })
    );
  }

  public actualizar(paralelo: Paralelo, codParalelo: any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarParalelo(paralelo, codParalelo).subscribe({
        next: (response: HttpResponse<Paralelo>) => {
          let actualizaUnidad: Paralelo = response.body;
          this.notificacionOK('Materia actualizada con éxito');

          this.editElementIndex = -1;

          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
            // this.showLoading = false;
          }
        },
      })
    );
  }

  public eliminar(codMateria: any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminarParalelo(codMateria).subscribe({
        next: (response: string) => {
          this.notificacionOK('Materia eliminada con éxito');
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          console.log(errorResponse);
        },
      })
    );
  }


}
