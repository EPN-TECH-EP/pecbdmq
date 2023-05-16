import {Ponderacion} from '../../modelo/admin/ponderacion';
import {PonderacionService} from '../../servicios/ponderacion.service';
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
import {
  MdbPopconfirmService,
} from 'mdb-angular-ui-kit/popconfirm';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Notificacion} from 'src/app/util/notificacion';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {ComponenteBase} from 'src/app/util/componente-base';
import {ValidacionUtil} from 'src/app/util/validacion-util';
import {OPCIONES_DATEPICKER} from '../../util/constantes/opciones-datepicker.const';
import {PonderacionTodo} from 'src/app/modelo/admin/ponderacion-todo';
import {FormControl} from "@angular/forms";

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
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  validacionUtil = ValidacionUtil;

  @ViewChild('table') table!: MdbTableDirective<Ponderacion>;
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
  estaEditando = false;
  codigoPonderacionEditando = 0;

  constructor(
    private ponderacionService: PonderacionService,
    private moduloService: ModuloService,
    private componenteNotaService: ComponenteNotaService,
    private tipoNotaService: TipoNotaService,
    private periodoAcademicoService: PeriodoAcademicoService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

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
      this.ponderacionService.getPonderacionTodo().subscribe((data) => {
        this.ponderaciones = data;
        console.log(data);
      })
    );

    this.subscriptions.push(
      this.moduloService.getModulo().subscribe((data) => {
        this.modulos = data;
      })
    );

    this.subscriptions.push(
      this.componenteNotaService.getComponenteNota().subscribe((data) => {
        this.componentes = data;
      })
    );

    this.subscriptions.push(
      this.tipoNotaService.getTipoNota().subscribe((data) => {
        this.tiposNota = data;
      })
    );

    this.subscriptions.push(
      this.periodoAcademicoService.getPeriodo().subscribe((data) => {
        this.periodos = data;
      })
    );
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    console.log(searchTerm);
    this.table.search(searchTerm);
  }

  crear(ponderacion: Ponderacion): void {
    ponderacion = {...ponderacion, estado: 'ACTIVO'};
    this.showLoading = true;

    // validación vacíos
    const vacios = ValidacionUtil.tienePropiedadesVacías(ponderacion);
    if (!ValidacionUtil.isNullOrEmptyArray(vacios)) {
      this.showLoading = false;
      Notificacion.notificar(this.notificationServiceLocal, 'Ingrese un valor: '.concat(vacios[0]), TipoAlerta.ALERTA_WARNING);
      return;
    }

    this.subscriptions.push(
      this.ponderacionService.registroPonderacion(ponderacion).subscribe({
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
            ).nombre,
            tipo_nota_desc: this.tiposNota.find(
              (tipoNota) => tipoNota.cod_tipo_nota === ponderacion.cod_tipo_nota
            ).nota,
            periodo_academico_desc: this.periodos.find(
              (periodo) => periodo.codigo === ponderacion.cod_periodo_academico
            ).descripcion,
          };

          this.ponderaciones.push(ponderacionTodo);
          this.ponderaciones = [...this.ponderaciones];
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Ponderacion creada con éxito');

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
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  editRow(ponderacion: Ponderacion) {
    this.ponderacionEditForm = {...ponderacion};
    this.codigoPonderacionEditando = ponderacion.cod_ponderacion;

    this.ponderacionEditForm.fechainiciovigencia = new Date(
      this.ponderacionEditForm.fechainiciovigencia);

    this.ponderacionEditForm.fechafinvigencia = new Date(
      this.ponderacionEditForm.fechafinvigencia);
  }

  undoRow() {
    this.estaEditando = false;
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

  actualizar(ponderacion: Ponderacion, formValue): void {

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

    this.showLoading = true;
    this.subscriptions.push(
      this.ponderacionService.actualizarPonderacion(
        ponderacion,
        ponderacion.cod_ponderacion
      ).subscribe({
        next: (response) => {
          let index = this.ponderaciones.findIndex(value1 => value1.cod_ponderacion === ponderacion.cod_ponderacion);
          let ponderacionTodo = {
            ...ponderacion,
            modulo_desc: this.modulos.find(
              (modulo) => modulo.cod_modulo === ponderacion.cod_modulo
            ).descripcion,
            componente_nota_desc: this.componentes.find(
              (componente) =>
                componente.cod_componente_nota ===
                ponderacion.cod_componente_nota
            ).nombre,
            tipo_nota_desc: this.tiposNota.find(
              (tipoNota) => tipoNota.cod_tipo_nota === ponderacion.cod_tipo_nota
            ).nota,
            periodo_academico_desc: this.periodos.find(
              (periodo) => periodo.codigo === ponderacion.cod_periodo_academico
            ).descripcion,
          };
          this.ponderaciones[index] = ponderacionTodo;
          this.ponderaciones = [...this.ponderaciones];
          this.codigoPonderacionEditando = 0;
          this.estaEditando = false;
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Ponderacion actualizada con éxito');
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  confirmarEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ponderacionService.eliminarPonderacion(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Ponderacion eliminada con éxito');
          this.showLoading = false;
          const index = this.ponderaciones.findIndex(
            (ponderacion) => ponderacion.cod_ponderacion === this.codigo
          );
          this.ponderaciones.splice(index, 1);
          this.ponderaciones = [...this.ponderaciones];
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
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
