import {Component, OnInit, ViewChild} from '@angular/core';
import {ITipoFalta} from "../../modelo/admin/tipo_falta";
import {TipoFaltaService} from "../../servicios/tipo-falta.service";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../util/alerta/alerta.component";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {Notificacion} from "../../util/notificacion";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {ComponenteBase} from 'src/app/util/componente-base';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ValidacionUtil} from 'src/app/util/validacion-util';

@Component({
  selector: 'app-tipo-falta',
  templateUrl: './tipo-falta.component.html',
  styleUrls: ['./tipo-falta.component.scss']
})
export class TipoFaltaComponent extends ComponenteBase implements OnInit {

  //model
  tiposFalta: ITipoFalta[];
  tipoFalta: ITipoFalta;
  tipoFaltaEditForm: ITipoFalta;

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
  @ViewChild('table') table!: MdbTableDirective<ITipoFalta>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Falta'];

  /**
    * Inicializa un nuevo objeto "TipoFalta" con valores por defecto.
    * 
    * @returns {ITipoFalta} Un objeto "TipoFalta" con valores predeterminados.
  */
  initializeTipoFalta(): ITipoFalta {
    return {
      codTipoFalta: 0,
      nombreFalta: '',
      estado: 'ACTIVO',
    };
  }


  constructor(private apiTipoFalta: TipoFaltaService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    ) {
      super(notificationServiceLocal, popconfirmServiceLocal);

    this.tiposFalta = [];
    
    this.tipoFalta = this.initializeTipoFalta();// Llamada al método initializeTipoFalta
    this.tipoFaltaEditForm = this.initializeTipoFalta();// Llamada al método initializeTipoFalta
  }

  ngOnInit(): void {
    this.subscriptions.push(
    this.apiTipoFalta.getTiposFalta().subscribe(data => {
      this.tiposFalta = data;
      })
    );
  }

 
  //create a register of tipo falta
  public createTipoFalta(tipoFalta: ITipoFalta): void {

    if (tipoFalta.nombreFalta === "") {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'El campo falta no puede estar vacío');

      return
    }

    tipoFalta = {...tipoFalta, estado: 'ACTIVO'}
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoFalta.createTipoFalta(tipoFalta).subscribe({
        next: (response: HttpResponse<ITipoFalta>) => {
          let newTipoFalta: ITipoFalta = response.body;
          this.tiposFalta.push(newTipoFalta);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo de falta creado correctamente');

          this.showLoading = false;
          this.tipoFalta = this.initializeTipoFalta();// Llamada al método initializeTipoFalta
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    )
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.tipoFaltaEditForm = {...this.tiposFalta[index]};
  }

  undoRow() {
    this.tipoFaltaEditForm = this.initializeTipoFalta();// Llamada al método initializeTipoFalta
    this.editElementIndex = -1;
  }

  //update a register of tipo falta
  public updateTipoFalta(tipoFalta: ITipoFalta, formValue: ITipoFalta): void {

    tipoFalta = {...tipoFalta, nombreFalta: formValue.nombreFalta, estado: "ACTIVO"};

    if (formValue.nombreFalta === "") {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'El campo falta no puede estar vacío');
      return
    }

        this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoFalta.updateTipoFalta(tipoFalta, tipoFalta.codTipoFalta).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo de falta actualizada correctamente');
          this.showLoading = false;
          this.tiposFalta[this.editElementIndex] = response.body
          this.tipoFalta = this.initializeTipoFalta();// Llamada al método initializeTipoFalta
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

  //delete a register of tipo falta
  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoFalta.deleteTipoFalta(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo de falta eliminada correctamente');
          this.showLoading = false;
          const index = this.tiposFalta.findIndex(tipoFalta => tipoFalta.codTipoFalta === this.codigo);
          this.tiposFalta.splice(index, 1);
          this.tiposFalta = [...this.tiposFalta];
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    )
  }

}
