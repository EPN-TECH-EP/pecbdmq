import {Ponderacion} from '../../modelo/admin/ponderacion';
import {PonderacionService} from './../../servicios/ponderacion.service';
import {Modulo} from 'src/app/modelo/admin/modulo';
import {ModuloService} from 'src/app/servicios/modulo.service';
import {ComponenteNota} from 'src/app/modelo/admin/componente-nota';
import {ComponenteNotaService} from 'src/app/servicios/componente-nota.service';
import {TipoNota} from 'src/app/modelo/admin/tipo-nota';
import {TipoNotaService} from 'src/app/servicios/tipo-nota.service';
import {Periodo} from 'src/app/modelo/admin/periodo-academico';
import {PeriodoAcademicoService} from 'src/app/servicios/periodo-academico.service';
import {Component, OnInit, Input} from '@angular/core';
import {ViewChild} from '@angular/core';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {MdbPopconfirmRef, MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {Subscription} from 'rxjs';
import {MdbNotificationRef, MdbNotificationService,} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Notificacion} from 'src/app/util/notificacion';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';


import {HeaderType} from 'src/app/enum/header-type.enum';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/compiler';
import {FormArray, FormControl} from '@angular/forms';
import {ComponenteBase} from 'src/app/util/componente-base';
import {OPCIONES_DATEPICKER} from "../../util/constantes/opciones-datepicker.const";

@Component({
  selector: 'app-ponderacion',
  templateUrl: './ponderacion.component.html',
  styleUrls: ['./ponderacion.component.scss']
})
export class PonderacionComponent extends ComponenteBase implements OnInit {
  ponderaciones: Ponderacion[];
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

  @ViewChild('table') table!: MdbTableDirective<Ponderacion>;
  editElementIndex = -1;
  addRow = false;

  headers = ['Módulo', 'Componente', 'Tipo de nota', 'Porcentaje final', 'Porcentaje nota', 'Fecha de inicio Vigencia', 'Fecha de fin Vigencia', 'Periodo académico'];
  translationOptions = OPCIONES_DATEPICKER

  constructor(
    private ApiPonderacion: PonderacionService,
    private ApiModulo: ModuloService,
    private ApiComponente: ComponenteNotaService,
    private ApiTipoNota: TipoNotaService,
    private ApiPeriodoAcademico: PeriodoAcademicoService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.ponderaciones = [];
    this.subscriptions = [];
    this.ponderacion = {
      cod_ponderacion: 0,
      cod_modulo: '',
      cod_periodo_academico: '',
      cod_componente_nota: '',
      cod_tipo_nota: '',
      porcentajefinalponderacion: 0,
      porcentajenotamateria: 0,
      fechainiciovigencia: new Date(''),
      fechafinvigencia: new Date(''),
      estado: 'ACTIVO'
    };
    this.ponderacionEditForm = {
      cod_ponderacion: 0,
      cod_modulo: '',
      cod_periodo_academico: '',
      cod_componente_nota: '',
      cod_tipo_nota: '',
      porcentajefinalponderacion: 0,
      porcentajenotamateria: 0,
      fechainiciovigencia: new Date(),
      fechafinvigencia: new Date(),
      estado: 'ACTIVO'
    };
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.ApiPonderacion.getPonderacion().subscribe(data => {
        this.ponderaciones = data;
        console.log(data);
      }));

    this.subscriptions.push(
      this.ApiModulo.getModulo().subscribe(data => {
        this.modulos = data;
      }));

    this.subscriptions.push(
      this.ApiComponente.getComponenteNota().subscribe(data => {
        this.componentes = data;
      }));

    this.subscriptions.push(
      this.ApiTipoNota.getTipoNota().subscribe(data => {
        this.tiposNota = data;
      }));

    this.subscriptions.push(
      this.ApiPeriodoAcademico.getPeriodo().subscribe(data => {
        this.periodos = data;
      }));
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

    ponderacion = {...ponderacion, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiPonderacion.registroPonderacion(ponderacion).subscribe({
        next: (response: HttpResponse<Ponderacion>) => {
          let nuevaPonderacion: Ponderacion = response.body;
          this.table.data.push(nuevaPonderacion);
          this.notificacionOK('Ponderacion creada con éxito');
          this.ponderacion = {
            cod_ponderacion: 0,
            cod_modulo: '',
            cod_periodo_academico: '',
            cod_componente_nota: '',
            cod_tipo_nota: '',
            porcentajefinalponderacion: 0,
            porcentajenotamateria: 0,
            fechainiciovigencia: new Date(),
            fechafinvigencia: new Date(),
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
    this.ponderacionEditForm = {...this.ponderaciones[index]};
    this.fechaInicioVigencia.setValue(this.ponderaciones[index].fechainiciovigencia);
    this.fechaFinVigencia.setValue(this.ponderaciones[index].fechafinvigencia);
  }

  undoRow() {
    this.ponderacionEditForm = {
      cod_ponderacion: 0,
      cod_modulo: '',
      cod_periodo_academico: '',
      cod_componente_nota: '',
      cod_tipo_nota: '',
      porcentajefinalponderacion: 0,
      porcentajenotamateria: 0,
      fechainiciovigencia: new Date(),
      fechafinvigencia: new Date(),
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }


  //actualizar
  public actualizar(ponderacion: Ponderacion, formValue): void {

    console.log(formValue.fechainiciovigencia);
    console.log(formValue.fechafinvigencia);

    ponderacion = {
      ...ponderacion,
      cod_modulo: formValue.cod_modulo,
      cod_componente_nota: formValue.cod_componente_nota,
      cod_tipo_nota: formValue.cod_tipo_nota,
      porcentajefinalponderacion: formValue.porcentajefinalponderacion,
      porcentajenotamateria: formValue.porcentajenotamateria,
      fechainiciovigencia: this.fechaInicioVigencia.value,
      fechafinvigencia: this.fechaFinVigencia.value,
      cod_periodo_academico: formValue.cod_periodo_academico,
      estado: 'ACTIVO'

    }

    console.log(ponderacion);

    this.showLoading = true;
    this.subscriptions.push(
      this.ApiPonderacion.actualizarPonderacion(ponderacion, ponderacion.cod_ponderacion).subscribe({
        next: (response) => {
          this.notificacionOK('Ponderacion actualizada con éxito');
          this.ponderaciones[this.editElementIndex] = response.body;
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
          const index = this.ponderaciones.findIndex(ponderacion => ponderacion.cod_ponderacion === this.codigo);
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
