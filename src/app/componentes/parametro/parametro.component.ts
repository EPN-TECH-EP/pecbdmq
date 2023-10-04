import {Component, OnInit, ViewChild } from '@angular/core';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {
  MdbPopconfirmService,
} from 'mdb-angular-ui-kit/popconfirm';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Notificacion} from '../../util/notificacion';
import {ComponenteBase} from '../../util/componente-base';
import {ValidacionUtil} from '../../util/validacion-util';
import { Parametro } from '../../modelo/admin/parametro';
import { ParametroService } from '../../servicios/parametro.service';
import { CambiosPendientes } from '../../modelo/util/cambios-pendientes';

@Component({
  selector: 'app-parametro',
  templateUrl: './parametro.component.html',
  styleUrls: ['./parametro.component.scss'],
})
export class ParametroComponent extends ComponenteBase implements OnInit, CambiosPendientes {
  parametros: Parametro[];
  parametro: Parametro;
  parametroEditForm: Parametro;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  codigo: number;
  data: Parametro;
  showLoading = false;

  validacionUtil = ValidacionUtil;

  options = [
    {value: 'ACTIVO', label: 'ACTIVO'},
    {value: 'INACTIVO', label: 'INACTIVO'},
  ];

  @ViewChild('table') table!: MdbTableDirective<Parametro>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Nombre', 'Valor'];

  constructor(
    private parametroService: ParametroService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.parametros = [];
    this.parametro = new Parametro();
    this.parametroEditForm = new Parametro();
  }

  ngOnInit(): void {
    this.subscriptions.push(
    this.parametroService.get().subscribe((data) => {
      this.parametros = data;
      this.parametros.sort((a, b) => (a.codParametro - b.codParametro));
      })
    );
  }

  public registro(parametro: Parametro): void {

    if (parametro.nombreParametro == '' || parametro.valor == '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,null,'Todos los campos deben estar llenos');
      return;
    }

    parametro.estado = "ACTIVO";
    this.showLoading = true;

    this.subscriptions.push(
      this.parametroService.crear(parametro).subscribe({
        next: (response: HttpResponse<Parametro>) => {
          let nuevoParametro: Parametro = response.body;
          this.parametros.push(nuevoParametro);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Parámetro creado con éxito');

          this.parametro = new Parametro();
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.parametroEditForm = {...this.parametros[index]};
  }

  undoRow() {
    this.parametroEditForm = new Parametro();
    this.editElementIndex = -1;
  }

  public actualizar(parametro: Parametro, formValue): void {

    if (formValue.nombre == '' || formValue.valor == '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,null,'Todos los campos deben estar llenos');
      return;
    }

    parametro.nombreParametro = formValue.nombreParametro;
    parametro.valor = formValue.valor;

    this.showLoading = true;
    this.subscriptions.push(
      this.parametroService.actualizar(parametro).subscribe({
        next: (response: HttpResponse<Parametro>) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Parámetro actualizado con éxito');
          this.parametros[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.parametro = new Parametro();
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          this.showLoading = false;
        },
      })
    );
  }

  public confirmaEliminar(event: Event, codigo: number, data: Parametro): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    this.data = data;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.parametroService.eliminar(this.codigo).subscribe({
        next: (response: string) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Parámetro eliminado con éxito');
          const index = this.parametros.indexOf(this.data);
          this.parametros.splice(index, 1);
          this.parametros = [...this.parametros]
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          console.log(errorResponse);
          this.showLoading = false;
        },
      })
    )
  }

  cambiosPendientes(): boolean {
    return this.editElementIndex !== -1;
  }

}
