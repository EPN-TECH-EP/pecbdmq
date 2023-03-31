import { TipoFuncionarioService } from './../../servicios/tipo-funcionario.service';
import { TipoFuncionario } from '../../modelo/tipo-funcionario';
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
  selector: 'app-tipo-funcionario',
  templateUrl: './tipo-funcionario.component.html',
  styleUrls: ['./tipo-funcionario.component.scss']
})

export class TipoFuncionarioComponent implements OnInit {
  //model
  tiposFuncionario: TipoFuncionario[];
  tipoFuncionario: TipoFuncionario;
  tipoFuncionarioEditForm: TipoFuncionario;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[];
  public showLoading: boolean;

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
    private notificationService: MdbNotificationService,
  ) {
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
  public registro(tipofuncionario: TipoFuncionario): void {
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

public eliminar(tipoFuncionarioId: any, data: TipoFuncionario): void {

  this.showLoading = true;
  this.subscriptions.push(
    this.ApiTipoFuncionario.eliminarTipoFuncionario(tipoFuncionarioId).subscribe({
      next: (response: string) => {
        this.notificacionOk('Tipo Funcionario eliminado con éxito');
        const index = this.tiposFuncionario.indexOf(data);
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
