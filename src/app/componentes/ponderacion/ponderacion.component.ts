import { Ponderacion } from '../../modelo/admin/ponderacion';
import { PonderacionService } from './../../servicios/ponderacion.service';
import { Modulo } from 'src/app/modelo/admin/modulo';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { ComponenteNota } from 'src/app/modelo/admin/componente-nota';
import { ComponenteNotaService } from 'src/app/servicios/componente-nota.service';
import { TipoNota } from 'src/app/modelo/admin/tipo-nota';
import { TipoNotaService } from 'src/app/servicios/tipo-nota.service';
import { Periodo } from 'src/app/modelo/admin/periodo-academico';
import { PeriodoAcademicoService } from 'src/app/servicios/periodo-academico.service';
import { Component, OnInit, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import {
  MdbPopconfirmRef,
  MdbPopconfirmService,
} from 'mdb-angular-ui-kit/popconfirm';
import { Subscription } from 'rxjs';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Notificacion } from 'src/app/util/notificacion';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';

import { HeaderType } from 'src/app/enum/header-type.enum';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { FormArray, FormControl } from '@angular/forms';
import { ComponenteBase } from 'src/app/util/componente-base';
import { ValidacionUtil } from 'src/app/util/validacion-util';
import { OPCIONES_DATEPICKER } from '../../util/constantes/opciones-datepicker.const';
import { PonderacionTodo } from 'src/app/modelo/admin/ponderacion-todo';

@Component({
  selector: 'app-ponderacion',
  templateUrl: './ponderacion.component.html',
  styleUrls: ['./ponderacion.component.scss'],
})
export class PonderacionComponent extends ComponenteBase implements OnInit {
  ponderaciones: PonderacionTodo[];
  modulos: Modulo[];
  componentes: ComponenteNota[];
  tiposNota: TipoNota[];
  periodos: Periodo[];
  ponderacion: Ponderacion;
  ponderacionEditForm: Ponderacion;

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  fechaInicioVigencia: FormControl = new FormControl();
  fechaFinVigencia: FormControl = new FormControl();

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[] = [];
  public userResponse: string;

  validacionUtil = ValidacionUtil;

  @ViewChild('table') table!: MdbTableDirective<Ponderacion>;
  editElementIndex = -1;
  addRow = false;

  headers = [
    'Módulo',
    'Componente',
    'Tipo de nota',
    'Porcentaje final',
    'Porcentaje nota',
    'Fecha de inicio Vigencia',
    'Fecha de fin Vigencia',
    'Periodo académico',
  ];
  translationOptions = OPCIONES_DATEPICKER;

  constructor(
    private ApiPonderacion: PonderacionService,
    private ApiModulo: ModuloService,
    private ApiComponente: ComponenteNotaService,
    private ApiTipoNota: TipoNotaService,
    private ApiPeriodoAcademico: PeriodoAcademicoService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.ponderaciones = [];
    this.subscriptions = [];
    this.ponderacion = {
      cod_ponderacion: 0,
      cod_modulo: null,
      cod_periodo_academico: null,
      cod_componente_nota: null,
      cod_tipo_nota: null,
      porcentajefinalponderacion: null,
      porcentajenotamateria: null,
      fechainiciovigencia: new Date(),
      fechafinvigencia: new Date(),
      estado: 'ACTIVO',
    };
    this.ponderacionEditForm = {
      cod_ponderacion: 0,
      cod_modulo: 0,
      cod_periodo_academico: 0,
      cod_componente_nota: 0,
      cod_tipo_nota: 0,
      porcentajefinalponderacion: 0,
      porcentajenotamateria: 0,
      fechainiciovigencia: new Date(),
      fechafinvigencia: new Date(),
      estado: 'ACTIVO',
    };
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.ApiPonderacion.getPonderacionTodo().subscribe((data) => {
        this.ponderaciones = data;
        console.log(data);
      })
    );

    this.subscriptions.push(
      this.ApiModulo.getModulo().subscribe((data) => {
        this.modulos = data;
      })
    );

    this.subscriptions.push(
      this.ApiComponente.getComponenteNota().subscribe((data) => {
        this.componentes = data;
      })
    );

    this.subscriptions.push(
      this.ApiTipoNota.getTipoNota().subscribe((data) => {
        this.tiposNota = data;
      })
    );

    this.subscriptions.push(
      this.ApiPeriodoAcademico.getPeriodo().subscribe((data) => {
        this.periodos = data;
      })
    );
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
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

  public notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  //registro
  public registro(ponderacion: Ponderacion): void {
    ponderacion = { ...ponderacion, estado: 'ACTIVO' };
    this.showLoading = true;

    // validación vacíos
    const vacios = ValidacionUtil.tienePropiedadesVacías(ponderacion);
    if (!ValidacionUtil.isNullOrEmptyArray(vacios)) {
      this.showLoading = false;
      Notificacion.notificar(this.notificationServiceLocal, 'Ingrese un valor: '.concat(vacios[0]), TipoAlerta.ALERTA_WARNING);
      return;
    }

    this.subscriptions.push(
      this.ApiPonderacion.registroPonderacion(ponderacion).subscribe({
        next: (response: HttpResponse<Ponderacion>) => {
          
          // guardar en array el nuevo objeto
          let nuevaPonderacion: Ponderacion = response.body;

          let ponderacionTodo = {
            ...nuevaPonderacion,
            modulo_desc: this.modulos.find(
              (modulo) => modulo.cod_modulo === ponderacion.cod_modulo
            ).descripcion,
            componente_nota_desc: this.componentes.find(
              (componente) =>
                componente.cod_componente_nota ===
                ponderacion.cod_componente_nota
            ).componentenota,
            tipo_nota_desc: this.tiposNota.find(
              (tipoNota) => tipoNota.cod_tipo_nota === ponderacion.cod_tipo_nota
            ).nota,
            periodo_academico_desc: this.periodos.find(
              (periodo) => periodo.codigo === ponderacion.cod_periodo_academico
            ).descripcion,
          };

          this.table.data.push(ponderacionTodo);
          this.notificacionOK('Ponderacion creada con éxito');
          this.addRow = false;
          this.ponderacion = {
            cod_ponderacion: 0,
            cod_modulo: 0,
            cod_periodo_academico: 0,
            cod_componente_nota: 0,
            cod_tipo_nota: 0,
            porcentajefinalponderacion: 0,
            porcentajenotamateria: 0,
            fechainiciovigencia: new Date(),
            fechafinvigencia: new Date(),
            estado: 'ACTIVO',
          };
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.ponderacionEditForm = { ...this.ponderaciones[index] };

    this.ponderacionEditForm.fechainiciovigencia = new Date(
      this.ponderacionEditForm.fechainiciovigencia);

    this.ponderacionEditForm.fechafinvigencia = new Date(
      this.ponderacionEditForm.fechafinvigencia);

  }

  undoRow() {
    this.ponderacionEditForm = {
      cod_ponderacion: 0,
      cod_modulo: 0,
      cod_periodo_academico: 0,
      cod_componente_nota: 0,
      cod_tipo_nota: 0,
      porcentajefinalponderacion: 0,
      porcentajenotamateria: 0,
      fechainiciovigencia: new Date(),
      fechafinvigencia: new Date(),
      estado: 'ACTIVO',
    };
    this.editElementIndex = -1;
  }

  //actualizar
  public actualizar(ponderacion: Ponderacion, formValue): void {

    ponderacion = {
      ...ponderacion,
      cod_modulo: formValue.cod_modulo,
      cod_componente_nota: formValue.cod_componente_nota,
      cod_tipo_nota: formValue.cod_tipo_nota,
      porcentajefinalponderacion: formValue.porcentajefinalponderacion,
      porcentajenotamateria: formValue.porcentajenotamateria,
      fechainiciovigencia: formValue.fechainiciovigencia,
      fechafinvigencia: formValue.fechafinvigencia,
      cod_periodo_academico: formValue.cod_periodo_academico,
      estado: 'ACTIVO',
    };

    // validación vacíos
    const vacios = ValidacionUtil.tienePropiedadesVacías(ponderacion);

    console.log(vacios);

    if (!ValidacionUtil.isNullOrEmptyArray(vacios)) {
      this.showLoading = false;
      Notificacion.notificar(this.notificationServiceLocal, 'Ingrese un valor: '.concat(vacios[0]), TipoAlerta.ALERTA_WARNING);
      return;
    }

    console.log(ponderacion);

    this.showLoading = true;
    this.subscriptions.push(
      this.ApiPonderacion.actualizarPonderacion(
        ponderacion,
        ponderacion.cod_ponderacion
      ).subscribe({
        next: (response) => {
          this.notificacionOK('Ponderacion actualizada con éxito');

          let ponderacionTodo = {
            ...ponderacion,
            modulo_desc: this.modulos.find(
              (modulo) => modulo.cod_modulo === ponderacion.cod_modulo
            ).descripcion,
            componente_nota_desc: this.componentes.find(
              (componente) =>
                componente.cod_componente_nota ===
                ponderacion.cod_componente_nota
            ).componentenota,
            tipo_nota_desc: this.tiposNota.find(
              (tipoNota) => tipoNota.cod_tipo_nota === ponderacion.cod_tipo_nota
            ).nota,
            periodo_academico_desc: this.periodos.find(
              (periodo) => periodo.codigo === ponderacion.cod_periodo_academico
            ).descripcion,
          };

          this.ponderaciones[this.editElementIndex] = ponderacionTodo;
          this.showLoading = false;
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
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
      this.ApiPonderacion.eliminarPonderacion(this.codigo).subscribe({
        next: () => {
          this.notificacionOK('Ponderacion eliminada con éxito');
          this.showLoading = false;
          const index = this.ponderaciones.findIndex(
            (ponderacion) => ponderacion.cod_ponderacion === this.codigo
          );
          this.ponderaciones.splice(index, 1);
          this.ponderaciones = [...this.ponderaciones];
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          console.log(errorResponse);
        },
      })
    );
  }











  value = new Date();

  onModelChange(event: any): void {
    console.log('model change date', event);
    this.value = event;
  }

  onDateChange(event: any) {
    console.log('event', event);
  }

  onOpen() {
    console.log('open');
  }
}
