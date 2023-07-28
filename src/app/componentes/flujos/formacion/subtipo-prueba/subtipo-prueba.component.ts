import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { catchError, of } from 'rxjs';
import { SubtipoPrueba } from 'src/app/modelo/admin/subtipo-prueba';
import { TipoPrueba } from 'src/app/modelo/admin/tipo-prueba';
import { FormacionService } from 'src/app/servicios/formacion/formacion.service';
import { TipoPruebaService } from 'src/app/servicios/tipo-prueba.service';
import { FORMACION } from 'src/app/util/constantes/fomacion.const';
import { ComponenteBase } from '../../../../util/componente-base';
import { MdbPopconfirmConfig } from '../../../../../../code/mdb-angular-ui-kit/popconfirm/popconfirm.config';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { SubtipoPruebaService } from '../../../../servicios/subtipo-prueba.service';
import { Notificacion } from 'src/app/util/notificacion';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-subtipo-prueba',
  templateUrl: './subtipo-prueba.component.html',
  styleUrls: ['./subtipo-prueba.component.scss'],
})
export class SubtipoPruebaComponent extends ComponenteBase implements OnInit {
  // datos
  tiposPrueba: TipoPrueba[];
  tipoPruebaSeleccionado: TipoPrueba;
  listaSubtipoPrueba: SubtipoPrueba[] = [];
  subtipoPruebaEdit: SubtipoPrueba;

  headers = [{ key: 'nombre', label: 'Nombre' }];

  // estado proceso
  esEstadoPruebas = false;

  // componentes
  @ViewChild('table') table: any;

  // eventos
  addRow = false;
  estaEditando = false;
  editIndex: number;
  codigo: number;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private mdbPopconfirmServiceLocal: MdbPopconfirmService,
    private formacionService: FormacionService,
    private tipoPruebaService: TipoPruebaService,
    private subtipoPruebaService: SubtipoPruebaService
  ) {
    super(notificationServiceLocal, mdbPopconfirmServiceLocal);
  }

  ngOnInit(): void {
    this.formacionService
      .getEstadoActual()
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          console.error(errorResponse);
          return of(null);
        })
      )
      .subscribe({
        next: (estado) => {
          if (!estado || estado.httpStatusCode !== 200) {
            return;
          }

          if (estado.mensaje === FORMACION.estadoPruebas) {
            this.esEstadoPruebas = true;

            this.tipoPruebaService.getTipoPrueba().subscribe((data) => {
              this.tiposPrueba = data;
            });
          }
        },
      });

    //TODO borrar
    /* this.esEstadoPruebas = true;

    this.tipoPruebaService.getTipoPrueba().subscribe((data) => {
      this.tiposPrueba = data;
    }); */
    //TODO FIN borrar

    this.initSubtipoPrueba();

  }

  initSubtipoPrueba() {
    this.subtipoPruebaEdit = {
      codSubtipoPrueba: null,
      codTipoPrueba: this.tipoPruebaSeleccionado?.codTipoPrueba,
      nombre: null,
      estado: 'ACTIVO',
    };
  }

  onTipoPruebaSeleccionado(tipoPrueba: TipoPrueba) {
    this.showLoading = true;

    this.tipoPruebaSeleccionado = tipoPrueba;
    console.log(this.tipoPruebaSeleccionado);

    // busca la lista de subtipos para el tipo seleccionado con el servicio subtipoPrueba.service
    this.subscriptions.push(
      this.subtipoPruebaService.listarPorTipoPrueba(this.tipoPruebaSeleccionado.codTipoPrueba).subscribe((data) => {
        this.listaSubtipoPrueba = data;
        this.showLoading = false;
      })
    );
  }

  // crear subtipo prueba
  onAgregarSubtipoPrueba(){
    this.addRow = true;
    this.initSubtipoPrueba();
  }

  crear(subtipoPrueba: SubtipoPrueba){

    this.subtipoPruebaEdit = {
      codSubtipoPrueba: null,
      codTipoPrueba: this.tipoPruebaSeleccionado?.codTipoPrueba,
      nombre: subtipoPrueba.nombre,
      estado: 'ACTIVO',
    }

    // validación vacios
    if (ValidacionUtil.isNullOrEmpty(this.subtipoPruebaEdit.nombre)) {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }

    this.showLoading = true;

    //objeto para crear    

    this.subscriptions.push(
      this.subtipoPruebaService.crear(this.subtipoPruebaEdit).subscribe({
        next: (response: HttpResponse<SubtipoPrueba>) => {
          let nuevo: SubtipoPrueba = response.body;
          this.listaSubtipoPrueba.push(nuevo);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Subtipo de Prueba creado con éxito');

          this.addRow = false;
          this.initSubtipoPrueba();
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          this.showLoading = false;
        }
      }
    ));    
  }

  editRow(subtipoPrueba: SubtipoPrueba, index: number) {
    this.estaEditando = true;    
    this.editIndex = index;
    this.subtipoPruebaEdit = {...subtipoPrueba};
  }

  undoRow() {
    this.estaEditando = false;
    this.editIndex = -1;
    this.initSubtipoPrueba();
  }

  public actualizar(subtipoPrueba: SubtipoPrueba, formValue: SubtipoPrueba): void {

    this.subtipoPruebaEdit = {//...this.subtipoPruebaEdit, 
    codSubtipoPrueba: formValue.codSubtipoPrueba,
    codTipoPrueba: this.tipoPruebaSeleccionado.codTipoPrueba,
    nombre: formValue.nombre,
    estado: formValue.estado
    };
    
    // validación vacios
    if (formValue.nombre === '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');      
      return;
    }

    // actualiza el subtipo de prueba con el servicio subtipoPrueba.service
    this.showLoading = true;
    this.subscriptions.push(
      this.subtipoPruebaService.actualizar(this.subtipoPruebaEdit, subtipoPrueba.codSubtipoPrueba).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Subtipo de Prueba actualizado con éxito');

          this.listaSubtipoPrueba[this.editIndex] = response.body;

          this.showLoading = false;
          this.estaEditando = false;
          this.editIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          this.showLoading = false;
        },
      })
    )
  }


//eliminar

  public confirmaEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.subtipoPruebaService.eliminar(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Subtipo de Prueba eliminado con éxito');
          this.showLoading = false;
          const index = this.listaSubtipoPrueba.findIndex(subtipoPrueba => subtipoPrueba.codSubtipoPrueba === this.codigo);
          this.listaSubtipoPrueba.splice(index, 1);
          this.listaSubtipoPrueba = [...this.listaSubtipoPrueba];
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    )
  }
}
