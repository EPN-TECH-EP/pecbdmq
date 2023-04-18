import { Ponderacion } from './../../modelo/ponderacion';
import { PonderacionService } from './../../servicios/ponderacion.service';
import { Modulo } from 'src/app/modelo/modulo';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { ComponenteNota } from 'src/app/modelo/componente-nota';
import { ComponenteNotaService } from 'src/app/servicios/componente-nota.service';
import { TipoNota } from 'src/app/modelo/tipo-nota';
import { TipoNotaService } from 'src/app/servicios/tipo-nota.service';
import { Periodo } from 'src/app/modelo/periodo_academico';
import { PeriodoAcademicoService } from 'src/app/servicios/periodo-academico.service';
import { Component, OnInit, Input } from '@angular/core';
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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ponderacion',
  templateUrl: './ponderacion.component.html',
  styleUrls: ['./ponderacion.component.scss']
})
export class PonderacionComponent implements OnInit {
  ponderaciones: Ponderacion[];
  modulos: Modulo[];
  componentes: ComponenteNota[];
  tiposNota: TipoNota[];
  periodos: Periodo[];
  ponderacion: Ponderacion;
  ponderacionEditForm: Ponderacion;


  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[] = [];
  public showLoading: boolean;
  public userResponse: string;

  @ViewChild('table') table!: MdbTableDirective<Ponderacion>;
  editElementIndex = -1;
  addRow = false;
  datepicker1= '' as any;
  datepicker2= '' as any;
  datepicker3= '' as any;
  datepicker4= '' as any;

  headers = ['Módulo', 'Componente', 'Tipo de nota', 'Porcentaje final', 'Porcentaje nota', 'Fecha de inicio Vigencia', 'Fecha de fin Vigencia', 'Periodo académico'];
  translationOptions = {
    title: 'Seleccionar Fecha',
    monthsFull: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    monthsShort: [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ],

    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    weekdaysNarrow: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    okBtnText: 'Ok',
    clearBtnText: 'Listo',
    cancelBtnText: 'Cancelar',
  };

  constructor(
    private ApiPonderacion: PonderacionService,
    private ApiModulo: ModuloService,
    private ApiComponente: ComponenteNotaService,
    private ApiTipoNota: TipoNotaService,
    private ApiPeriodoAcademico: PeriodoAcademicoService,
    private notificationService: MdbNotificationService,

  ) {
    this.ponderaciones = [];
    this.subscriptions = [];
    this.ponderacion = {
      codigo: 0,
      modulo: '',
      componente: '',
      tiponota: '',
      porcentajefinal: '' as any,
      porcentajenota: '' as any,
      fechaInicioVigencia: '' as any,
      fechaFinVigencia: '' as any,
      periodo: '',
      estado: 'ACTIVO'
    }
    this.ponderacionEditForm = {
      codigo: 0,
      modulo: '',
      componente: '',
      tiponota: '',
      porcentajefinal: '' as any,
      porcentajenota: '' as any,
      fechaInicioVigencia: '' as any,
      fechaFinVigencia: '' as any,
      periodo: '',
      estado: 'ACTIVO'
    };
  }

  ngOnInit(): void {
    this.ApiPonderacion.getPonderacion().subscribe(data => {
      this.ponderaciones = data;
    })
    this.ApiModulo.getModulo().subscribe(data => {
      this.modulos = data;
    })
    this.ApiComponente.getComponenteNota().subscribe(data => {
      this.componentes = data;
    })
    this.ApiTipoNota.getTipoNota().subscribe(data => {
      this.tiposNota = data;
    })
    this.ApiPeriodoAcademico.getPeriodo().subscribe(data => {
      this.periodos = data;
    })
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
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }


  public notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }
  //registro
  public registro(ponderacion: Ponderacion): void {

    ponderacion = { ...ponderacion, estado: 'ACTIVO' };
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiPonderacion.registroPonderacion(ponderacion).subscribe({
        next: (response: HttpResponse<Ponderacion>) => {
          let nuevaPonderacion: Ponderacion = response.body;
          this.table.data.push(nuevaPonderacion);
          this.notificacionOK('Ponderacion creada con éxito');
          this.ApiPonderacion.getPonderacion().subscribe(data => {
            this.ponderaciones = data;
          });
          this.ponderacion = {
            codigo: 0,
            modulo: '',
            componente: '',
            tiponota: '',
            porcentajefinal: '' as any,
            porcentajenota: '' as any,
            fechaInicioVigencia: '' as any,
            fechaFinVigencia: '' as any,
            periodo: '',
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
    this.ponderacionEditForm = { ...this.ponderaciones[index] };
  }

  undoRow() {
    this.ponderacionEditForm = {
      codigo: 0,
      modulo: '',
      componente: '',
      tiponota: '',
      porcentajefinal: '' as any,
      porcentajenota: '' as any,
      fechaInicioVigencia: '' as any,
      fechaFinVigencia: '' as any,
      periodo: '',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }



  //actualizar
  public actualizar(ponderacion: Ponderacion, formValue): void {

    ponderacion = { ...ponderacion,
      modulo: formValue.modulo,
      componente: formValue.componente,
      tiponota: formValue.tiponota,
      porcentajefinal: formValue.porcentajefinal,
      porcentajenota: formValue.porcentajenota,
      fechaInicioVigencia: formValue.fechaInicioVigencia,
      fechaFinVigencia: formValue.fechaFinVigencia,
      estado: 'ACTIVO' }
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiPonderacion.actualizarPonderacion(ponderacion, ponderacion.codigo).subscribe({
        next: (response) => {
          this.notificacionOK('Ponderacion actualizada con éxito');
          this.ponderaciones[this.editElementIndex] = response.body;
          this.showLoading = false;

          this.editElementIndex = -1;
          this.ApiPonderacion.getPonderacion().subscribe(data => {
            this.ponderaciones = data;
          })

        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }

  //eliminar

  public eliminar(codigo: number): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiPonderacion.eliminarPonderacion(codigo).subscribe({
        next: () => {
          this.notificacionOK('Ponderacion eliminada con éxito');
          this.showLoading = false;
          const index = this.ponderaciones.findIndex(ponderacion => ponderacion.codigo === codigo);
          this.ponderaciones.splice(index, 1);
          this.ponderaciones = [...this.ponderaciones]
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          console.log(errorResponse);
        },
      })
    );
  }

}
