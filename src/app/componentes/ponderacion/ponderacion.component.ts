import { Ponderacion } from '../../modelo/admin/ponderacion';
import { PonderacionService } from './../../servicios/ponderacion.service';
import { Modulo } from 'src/app/modelo/admin/modulo';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { ComponenteNota } from 'src/app/modelo/admin/componente-nota';
import { ComponenteNotaService } from 'src/app/servicios/componente-nota.service';
import { TipoNota } from 'src/app/modelo/admin/tipo-nota';
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
//    'Tipo nota',
    '% final',
//    '% nota',
//    'F. inicio Vigencia',
//    'F. fin Vigencia',
    'Periodo académico',
  ];
  translationOptions = OPCIONES_DATEPICKER;

  constructor(
    private ApiPonderacion: PonderacionService,
    private ApiModulo: ModuloService,
    private ApiComponente: ComponenteNotaService,
    private ApiPeriodoAcademico: PeriodoAcademicoService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.ponderaciones = [];
    this.subscriptions = [];
    this.ponderacion = {
      codPonderacion: 0,
      codModulo: null,
      codPeriodoAcademico: null,
      codComponenteNota: null,
      //codTipoNota: null,
      porcentajeFinalPonderacion: null,
      //porcentajeNotaMateria: null,
      //fechaInicioVigencia: new Date(),
      //fechaFinVigencia: new Date(),
      estado: 'ACTIVO',
    };
    this.ponderacionEditForm = {
      codPonderacion: 0,
      codModulo: 0,
      codPeriodoAcademico: 0,
      codComponenteNota: 0,
      //codTipoNota: 0,
      porcentajeFinalPonderacion: 0,
      //porcentajeNotaMateria: 0,
      //fechaInicioVigencia: new Date(),
      //fechaFinVigencia: new Date(),
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

    /* this.subscriptions.push(
      this.ApiTipoNota.getTipoNota().subscribe((data) => {
        this.tiposNota = data;
      })
    ); */

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
 
  
  //registro
  public registro(ponderacion: Ponderacion): void {
    ponderacion = { ...ponderacion, estado: 'ACTIVO' };
    this.showLoading = true;

    // validación vacíos
    const vacios = ValidacionUtil.tienePropiedadesVacías(ponderacion);

    if (!ValidacionUtil.isNullOrEmptyArray(vacios)) {
      this.showLoading = false;

      // busca la etiqueta a mostrar
      let index = 0;
      for (let key in ponderacion) {        
        if (key === vacios[0]) {
          break;
        }
        index++;
      }

      Notificacion.notificar(
        this.notificationServiceLocal,
        'Ingrese un valor: '.concat(/*vacios[0]*/this.headers[index]),
        TipoAlerta.ALERTA_WARNING
      );
      return;
    }

    if (
      ValidacionUtil.isNullOrEmptyNumber(
        ponderacion.porcentajeFinalPonderacion
      ) 
    ) {
      this.showLoading = false;
      Notificacion.notificar(
        this.notificationServiceLocal,
        'Ingrese un valor válido de porcentaje',
        TipoAlerta.ALERTA_WARNING
      );
      return;
    }

    this.subscriptions.push(
      this.ApiPonderacion.registroPonderacion(ponderacion).subscribe({
        next: (response: HttpResponse<Ponderacion>) => {
          // guardar en array el nuevo objeto
          let nuevaPonderacion: Ponderacion = response.body;

          let ponderacionTodo = {
            ...nuevaPonderacion,
            moduloDesc: this.modulos.find(
              (modulo) => modulo.codModulo === ponderacion.codModulo
            ).etiqueta,
            componenteNotaDesc: this.componentes.find(
              (componente) =>
                componente.codComponenteNota ===
                ponderacion.codComponenteNota
            ).nombre,            
            periodoAcademicoDesc: this.periodos.find(
              (periodo) => periodo.codigo === ponderacion.codPeriodoAcademico
            ).descripcion,
          };

          //this.table.data.push(ponderacionTodo);

          this.ponderaciones.push(ponderacionTodo);
          this.ponderaciones = [...this.ponderaciones];

          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Ponderación creada con éxito'
          );

          this.addRow = false;
          this.ponderacion = {
            codPonderacion: 0,
            codModulo: 0,
            codPeriodoAcademico: 0,
            codComponenteNota: 0,
            //codTipoNota: 0,
            porcentajeFinalPonderacion: 0,
            //porcentajeNotaMateria: 0,
            //fechaInicioVigencia: new Date(),
            //fechaFinVigencia: new Date(),
            estado: 'ACTIVO',
          };
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.ponderacionEditForm = { ...this.ponderaciones[index] };

    /* this.ponderacionEditForm.fechaInicioVigencia = new Date(
      this.ponderacionEditForm.fechaInicioVigencia
    );

    this.ponderacionEditForm.fechaFinVigencia = new Date(
      this.ponderacionEditForm.fechaFinVigencia
    ); */
  }

  undoRow() {
    this.ponderacionEditForm = {
      codPonderacion: 0,
      codModulo: 0,
      codPeriodoAcademico: 0,
      codComponenteNota: 0,
      //codTipoNota: 0,
      porcentajeFinalPonderacion: 0,
      //porcentajeNotaMateria: 0,
      //fechaInicioVigencia: new Date(),
      //fechaFinVigencia: new Date(),
      estado: 'ACTIVO',
    };
    this.editElementIndex = -1;
  }

  //actualizar
  public actualizar(ponderacion: Ponderacion, formValue: Ponderacion): void {
    ponderacion = {
      ...this.ponderacionEditForm,
      codModulo: formValue.codModulo,
      codComponenteNota: formValue.codComponenteNota,
      //codTipoNota: formValue.cod_tipo_nota,
      porcentajeFinalPonderacion: formValue.porcentajeFinalPonderacion,
      //porcentajeNotaMateria: formValue.porcentajeNotaMateria,
      //fechaInicioVigencia: formValue.fechaInicioVigencia,
      //fechaFinVigencia: formValue.fechaFinVigencia,
      codPeriodoAcademico: formValue.codPeriodoAcademico,
      estado: 'ACTIVO',
    };

    console.log(ponderacion);
    console.log(formValue);

    // validación vacíos
    const vacios = ValidacionUtil.tienePropiedadesVacías(ponderacion);
    if (!ValidacionUtil.isNullOrEmptyArray(vacios)) {
      this.showLoading = false;

      // busca la etiqueta a mostrar
      let index = 0;
      for (let key in ponderacion) {        
        if (key === vacios[0]) {
          break;
        }
        index++;
      }

      Notificacion.notificar(
        this.notificationServiceLocal,
        'Ingrese un valor: '.concat(/*vacios[0]*/this.headers[index]),
        TipoAlerta.ALERTA_WARNING
      );
      return;
    }

    if (
      ValidacionUtil.isNullOrEmptyNumber(
        ponderacion.porcentajeFinalPonderacion
      ) 
    ) {
      this.showLoading = false;
      Notificacion.notificar(
        this.notificationServiceLocal,
        'Ingrese un valor válido de porcentaje',
        TipoAlerta.ALERTA_WARNING
      );
      return;
    }

    this.showLoading = true;
    this.subscriptions.push(
      this.ApiPonderacion.actualizarPonderacion(
        ponderacion,
        ponderacion.codPonderacion
      ).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Ponderación actualizada con éxito'
          );

          let ponderacionTodo = {
            ...ponderacion,
            moduloDesc: this.modulos.find(
              (modulo) => modulo.codModulo === ponderacion.codModulo
            ).etiqueta,
            componenteNotaDesc: this.componentes.find(
              (componente) =>
                componente.codComponenteNota ===
                ponderacion.codComponenteNota
            ).nombre,            
            periodoAcademicoDesc: this.periodos.find(
              (periodo) => periodo.codigo === ponderacion.codPeriodoAcademico
            ).descripcion,
          };

          this.ponderaciones[this.editElementIndex] = ponderacionTodo;
          this.showLoading = false;
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
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
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Ponderación eliminada con éxito'
          );
          this.showLoading = false;
          const index = this.ponderaciones.findIndex(
            (ponderacion) => ponderacion.codPonderacion === this.codigo
          );
          this.ponderaciones.splice(index, 1);
          this.ponderaciones = [...this.ponderaciones];
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
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
