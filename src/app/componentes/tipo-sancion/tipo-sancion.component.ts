import {Component, OnInit, ViewChild} from '@angular/core';
import {ITipoSancion} from "../../modelo/admin/tipo_sancion";
import {TipoSancionService} from "../../servicios/tipo-sancion.service";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../util/alerta/alerta.component";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {Notificacion} from "../../util/notificacion";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {ComponenteBase} from 'src/app/util/componente-base';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ValidacionUtil} from 'src/app/util/validacion-util';

@Component({
  selector: 'app-tipo-sancion',
  templateUrl: './tipo-sancion.component.html',
  styleUrls: ['./tipo-sancion.component.scss']
})
export class TipoSancionComponent extends ComponenteBase implements OnInit {

  //model
  tiposSancion: ITipoSancion[];
  tipoSancion: ITipoSancion;
  tipoSancionEditForm: ITipoSancion;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[];

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  validacionUtil = ValidacionUtil;

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

  constructor(private apiTipoSancion: TipoSancionService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    ) {
      super(notificationServiceLocal, popconfirmServiceLocal);

    this.tiposSancion = [];
    this.subscriptions = [];
    this.tipoSancion = {
      codTipoSancion: 0,
      sancion: '',
      estado: 'ACTIVO'
    }
    this.tipoSancionEditForm = {
      codTipoSancion: 0,
      estado: 'ACTIVO',
      sancion: ''
    }
  }

  ngOnInit(): void {
    this.apiTipoSancion.getTiposSancion().subscribe(data => {
      this.tiposSancion = data;
    });
  }

  /*
  public okNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_ERROR
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
      this.notificationServiceLocal,
      messageError,
      tipoAlerta
    )
  }
  */

  //create a register of tipo sancion
  public createTipoSancion(tipoSancion: ITipoSancion): void {

    if (tipoSancion.sancion === "") {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'El campo sanción no puede estar vacío');

      return
    }

    tipoSancion = {...tipoSancion, estado: 'ACTIVO'}
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoSancion.createTipoSancion(tipoSancion).subscribe({
        next: (response: HttpResponse<ITipoSancion>) => {
          let newTipoSancion: ITipoSancion = response.body;
          this.tiposSancion.push(newTipoSancion);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo de sanción creado correctamente');

          this.showLoading = false;
          this.tipoSancion = {
            codTipoSancion: 0,
            estado: 'ACTIVO',
            sancion: ''
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    )
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.tipoSancionEditForm = {...this.tiposSancion[index]};
  }

  undoRow() {
    this.tipoSancionEditForm = {
      codTipoSancion: 0,
      estado: 'ACTIVO',
      sancion: ''
    }
    this.editElementIndex = -1;
  }

  //update a register of tipo sancion
  public updateTipoSancion(tipoSancion: ITipoSancion, formValue): void {

    tipoSancion = {...tipoSancion, sancion: formValue.sancion, estado: "ACTIVO"};

    if (formValue.sancion === "") {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'El campo sanción no puede estar vacío');
      return
    }

        this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoSancion.updateTipoSancion(tipoSancion, tipoSancion.codTipoSancion).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo de sanción actualizada correctamente');
          this.showLoading = false;
          this.tiposSancion[this.editElementIndex] = response.body
          this.tipoSancion = {
            codTipoSancion: 0,
            estado: 'ACTIVO',
            sancion: ''
          }
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    )
  }

  // eliminar
  public confirmaEliminar(event: Event, codigo: number): void {
  super.confirmaEliminarMensaje();
  this.codigo = codigo;
  super.openPopconfirm(event, this.eliminar.bind(this));
  }

  //delete a register of tipo sancion
  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoSancion.deleteTipoSancion(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo de sanción eliminada correctamente');
          this.showLoading = false;
          const index = this.tiposSancion.findIndex(tipoSancion => tipoSancion.codTipoSancion === this.codigo);
          this.tiposSancion.splice(index, 1);
          this.tiposSancion = [...this.tiposSancion];
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    )
  }

}
