import { TipoFuncionarioService } from './../../servicios/tipo-funcionario.service';
import { TipoFuncionario } from '../../modelo/admin/tipo-funcionario';
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
import { ComponenteBase } from 'src/app/util/componente-base';

@Component({
  selector: 'app-tipo-funcionario',
  templateUrl: './tipo-funcionario.component.html',
  styleUrls: ['./tipo-funcionario.component.scss']
})

export class TipoFuncionarioComponent extends ComponenteBase implements OnInit {
  //model
  tiposFuncionario: TipoFuncionario[];
  tipoFuncionario: TipoFuncionario;
  tipoFuncionarioEditForm: TipoFuncionario;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[];

  // codigo de item a modificar o eliminar
  codigo: number;
  data: TipoFuncionario;
  showLoading = false;

 //options
 options = [
  { value: 'ACTIVO', label: 'ACTIVO' },
  { value: 'INACTIVO', label: 'INACTIVO' },
];
//table
@ViewChild('table') table!: MdbTableDirective<TipoFuncionario>;
editElementIndex = -1;
addRow = false;
headers = ['Nombre'];

  constructor(
    private ApiTipoFuncionario: TipoFuncionarioService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.tiposFuncionario = [];
    this.subscriptions = [];
    this.tipoFuncionario = {
      codigo: 0,
      nombre: '',
      estado: 'ACTIVO'
    }
    this.tipoFuncionarioEditForm = {
      codigo: 0,
      nombre: '',
      estado: 'ACTIVO'
    };
   }



  ngOnInit(): void {
    this.ApiTipoFuncionario.getTipoFuncionario().subscribe(data => {
      this.tiposFuncionario = data;
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
      this.notificationServiceLocal,
      mensajeError,
      tipoAlerta
    );
  }


  public notificacionOk(mensaje: string) {
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

  //registro
  public registro(tipofuncionario: TipoFuncionario): void {

    if(tipofuncionario.nombre === ''){
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    tipofuncionario={...tipofuncionario, estado:'ACTIVO'},
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoFuncionario.crearTipoFuncionario(tipofuncionario).subscribe({
        next: (response: HttpResponse<TipoFuncionario>) => {
          let nuevoTipoFuncionario: TipoFuncionario = response.body;
          this.tiposFuncionario.push(nuevoTipoFuncionario);
          this.notificacionOk('Tipo funcionario creado con éxito');
          this.tipoFuncionario = {
            codigo: 0,
            nombre: '',
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
    this.tipoFuncionarioEditForm = {...this.tiposFuncionario[index]};
  }

  undoRow() {
    this.tipoFuncionarioEditForm = {
      codigo: 0,
      nombre: '',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }

  //actualizar
  public actualizar(tipoFuncionario: TipoFuncionario, formValue): void {

    if (formValue.nombre === '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    tipoFuncionario = {...tipoFuncionario, nombre: formValue.nombre, estado:'ACTIVO'},
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoFuncionario.actualizarTipoFuncionario(tipoFuncionario,tipoFuncionario.codigo).subscribe({
      next: (response: HttpResponse<TipoFuncionario>) => {
        this.notificacionOk('Tipo funcionario actualizado con éxito');
        this.tiposFuncionario[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.tipoFuncionario = {
            codigo: 0,
            nombre: '',
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

  public confirmaEliminar(event: Event, codigo: number, data: TipoFuncionario): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    this.data = data;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

public eliminar(): void {

  this.showLoading = true;
  this.subscriptions.push(
    this.ApiTipoFuncionario.eliminarTipoFuncionario(this.codigo).subscribe({
      next: (response: string) => {
        this.notificacionOk('Tipo Funcionario eliminado con éxito');
        const index = this.tiposFuncionario.indexOf(this.data);
        this.tiposFuncionario.splice(index, 1);
        this.tiposFuncionario = [...this.tiposFuncionario]
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
