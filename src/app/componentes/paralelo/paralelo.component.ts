import {ParaleloService} from "../../servicios/paralelo.service";
import {Paralelo} from "../../modelo/admin/paralelo";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Component, OnInit, OnDestroy} from '@angular/core';
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {Subscription} from "rxjs";
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';

import {Notificacion} from "../../util/notificacion";
import {ViewChild} from '@angular/core';
import {MdbTableDirective} from "mdb-angular-ui-kit/table";

import {AlertaComponent} from "../util/alerta/alerta.component";
import {ComponenteBase} from "src/app/util/componente-base";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {ValidacionUtil} from "src/app/util/validacion-util";

@Component({
  selector: 'app-paralelo',
  templateUrl: './paralelo.component.html',
  styleUrls: ['./paralelo.component.scss']
})
export class ParaleloComponent extends ComponenteBase implements OnInit {
  paralelos: Paralelo[];
  paralelo: Paralelo;
  paraleloEdit: Paralelo;

  notificationRef: MdbNotificationRef<AlertaComponent> | null;
  //private subscriptions: Subscription[];

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  validacionUtil = ValidacionUtil;

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
    'Nombre Paralelo',
    //'Estado',
  ];
  headersDos: string[] = [];


  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private Api: ParaleloService
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.paralelos = [];
    this.subscriptions = [];
    this.notificationRef = null;
    this.paralelo = {
      codParalelo: 0,
      nombreParalelo: '',
      estado: 'ACTIVO'
    }
    this.paraleloEdit = {
      codParalelo: 0,
      nombreParalelo: '',
      estado: 'ACTIVO'
    }
  }

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros(): void {
    this.Api.getParalelos().subscribe(data => {
      this.paralelos = data;
    });
  }

  addNewRow() {
    const newRow: Paralelo = this.paralelo;
    this.paralelos = [...this.paralelos, {...newRow}]
    this.paralelo = {
      codParalelo: 0,
      nombreParalelo: '',
      estado: '',
    }

  }
/*
  public notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
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
      this.notificationServiceLocal,
      mensajeError,
      tipoAlerta
    )
  }
*/
  public registro(paralelo: Paralelo): void {

    if(paralelo.nombreParalelo == ''){
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Ingrese un nombre de paralelo');
      return;
    }

    paralelo = {...paralelo, estado: 'ACTIVO'}
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.registroParalelo(paralelo).subscribe({
        next: (response: HttpResponse<Paralelo>) => {
          let nuevoParalelo: Paralelo = response.body;
          this.paralelos.push(nuevoParalelo);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Paralelo creado con éxito');

          this.showLoading = false;
          this.paralelo = {
            codParalelo: 0,
            nombreParalelo: '',
            estado: '',
          }
          this.cargarRegistros();
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          //  this.showLoading = false;
        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    const offset = this.paginaActual > 0 ? this.indiceAuxRegistro : 0;
    this.paraleloEdit = {...this.paralelos[index + offset]};
  }

  undoRow() {
    this.paraleloEdit = {
      codParalelo: 0,
      nombreParalelo: '',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }

  public actualizar(paralelo: Paralelo, formValue): void {

    if(formValue.nombreParalelo == ''){
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Ingrese un nombre de paralelo');
      return;
    }

    paralelo = {...paralelo, estado: 'ACTIVO', nombreParalelo: formValue.nombreParalelo};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarParalelo(paralelo, paralelo.codParalelo).subscribe({
          next: (response) => {
            Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Paralelo actualizado con éxito');
            const index = this.editElementIndex + (this.paginaActual > 0 ? this.indiceAuxRegistro : 0);
            this.paralelos[index] = response.body;
            this.editElementIndex = -1;
            this.showLoading = false;
            this.paralelo = {
              codParalelo: 0,
              nombreParalelo: '',
              estado: '',
            }
          },

          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
            // this.showLoading = false;
          },
        }
      )
    );
  }

// eliminar
  public confirmaEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminarParalelo(this.codigo).subscribe({
        next: (response: string) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Paralelo eliminado con éxito');
          this.showLoading = false;
          const index = this.paralelos.findIndex(paraleloO => paraleloO.codParalelo === this.codigo);
          this.paralelos.splice(index, 1);
          this.paralelos = [...this.paralelos];
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    );
  }

  advancedSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  filterFn(datos: any, terminoBuscado: string): boolean {
    let phrase = terminoBuscado.trim();
    //El nombre de las llaves en las que quiero buscar
    let KeysWanted = [
      'NombreParalelo',
    ];

    return Object.keys(datos).some((key: any) => {
      if (KeysWanted?.length) {
        let result;
        KeysWanted.forEach((keyWanted) => {
          if (
            keyWanted.toLowerCase().trim() === key.toLowerCase() &&
            datos[key].toLowerCase().includes(phrase.toLowerCase())
          ) {
            result = true;
          }
        });
        return result;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}





















