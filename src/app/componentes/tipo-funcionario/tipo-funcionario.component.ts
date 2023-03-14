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
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  tiposfuncionario: TipoFuncionario[];
  public showLoading: boolean;

  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];
  constructor(

    private ApiTipoFuncionario: TipoFuncionarioService,
    private notificationService: MdbNotificationService,
    public Valtipofuncionario:TipoFuncionario
  ) { }

  @ViewChild('table') table!: MdbTableDirective<TipoFuncionario>;
  editElementIndex = -1;
  addRow = false;
  // Codigo = '';
  // Nombre = '';
  // Estado = 'ACTIVO';
  headers = ['Nombre'];

  addNewRow() {
    const newRow: TipoFuncionario = {
      codigo: this.Valtipofuncionario.codigo,
      nombre: this.Valtipofuncionario.nombre,
      estado: this.Valtipofuncionario.estado,
    }
    this.tiposfuncionario = [...this.tiposfuncionario, { ...newRow }];
    this.Valtipofuncionario.codigo = '';
    this.Valtipofuncionario.nombre = '';
    this.Valtipofuncionario.estado = 'ACTIVO';
  }

  ngOnInit(): void {
    this.Valtipofuncionario.estado = 'ACTIVO';
    this.ApiTipoFuncionario.getTipoFuncionario().subscribe(data => {
      this.tiposfuncionario = data;

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
          this.tiposfuncionario.push(nuevoTipoFuncionario);
          this.notificacionOk('Tipo funcionario creado con éxito');
          this.Valtipofuncionario.nombre = '';
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
  public actualizar(tipofuncionario: TipoFuncionario, tipofuncionarioId:any): void {
    tipofuncionario={...tipofuncionario, estado:'ACTIVO'},
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoFuncionario.actualizarTipoFuncionario(tipofuncionario,tipofuncionarioId).subscribe({
      next: (response: HttpResponse<TipoFuncionario>) => {
        let actualizaTipoFuncionario: TipoFuncionario = response.body;
        this.notificacionOk('Tipo funcionario actualizado con éxito');
        this.editElementIndex=-1;
        this.showLoading = false;
        this.Valtipofuncionario.nombre = '';
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
        const index = this.tiposfuncionario.indexOf(data);
        this.tiposfuncionario.splice(index, 1);
        this.tiposfuncionario = [...this.tiposfuncionario]
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
