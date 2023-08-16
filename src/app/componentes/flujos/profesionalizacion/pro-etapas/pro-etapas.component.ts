import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MdbNotificationRef, MdbNotificationService,} from 'mdb-angular-ui-kit/notification';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ComponenteBase} from '../../../../util/componente-base';
import {ValidacionUtil} from '../../../../util/validacion-util';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {ActivatedRoute} from '@angular/router';
import {Notificacion} from '../../../../util/notificacion';
import {Etapas} from "../../../../modelo/admin/profesionalizacion/pro-etapas";
import {EtapaService} from "../../../../servicios/profesionalizacion/pro-etapas.service";

@Component({
  selector: 'app-etapas',
  templateUrl: './pro-etapas.component.html',
  styleUrls: ['./pro-etapas.component.scss'],
})

export class EtapasComponent extends ComponenteBase implements OnInit {
  etapas: Etapas[];
  etapa: Etapas;
  etapasEditForm: Etapas;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  codigo: number;
  showLoading = false;
  validacionUtil = ValidacionUtil;
  userResponse: string;

  @ViewChild('table') table!: MdbTableDirective<Etapas>;
  addRow = false;

  headers = [
    'Nombre Etapa'

  ];

  estaEditando = false;
  codigoEtapasEditando = 0;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private etapasService: EtapaService,
    private route: ActivatedRoute
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);
    const module = this.route.snapshot.data.module;

    this.showLoading = false;

    this.etapas = [];
    this.subscriptions = [];
    this.etapa = this.initObject();
    this.etapasEditForm = this.initObject();
  }

  ngOnInit(): void {
    this.etapasService.listar().subscribe((data) => {
      this.etapas = data;
    });
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  editRow(etapa: Etapas) {
    this.etapasEditForm = {...etapa};
    this.codigoEtapasEditando = etapa.codEtapa;
  }

  undoRow() {
    this.estaEditando = false;
    this.etapasEditForm = this.initObject();
  }

  initObject(): Etapas {
    return {
      codEtapa: 0,
      nombreEtapa: '',
      estado: 'ACTIVO',
    };
  }

  crear(etapa: Etapas): void {
    if (
      etapa.nombreEtapa === '' // ||
      // ValidacionUtil.isNullOrEmptyNumber(materia.numHoras) ||
      // materia.codEjeMateria == 0
      // materia.observacionMateria == '' ||
      // ValidacionUtil.isNullOrEmptyNumber(materia.pesoMateria) ||
      // ValidacionUtil.isNullOrEmptyNumber(materia.notaMinima)
    ) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    etapa = {...etapa, estado: 'ACTIVO'};
    this.showLoading = true;
    this.userResponse = 'Lunes';
    this.subscriptions.push(
      this.etapasService.crear(etapa).subscribe({
        next: (response: HttpResponse<Etapas>) => {
          const nuevaEtapa: Etapas = response.body;
          this.etapas.push(nuevaEtapa);
          this.etapas = [...this.etapas];
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Etapa creada con éxito'
          );

          this.addRow = false;

          this.etapa = this.initObject();
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

  actualizar(etapa: Etapas, formValue): void {
    if (
      formValue.nombreEtapa === ''
      // ValidacionUtil.isNullOrEmptyNumber(formValue.numHoras) ||
      // formValue.observacionMateria == '' ||
      // ValidacionUtil.isNullOrEmptyNumber(formValue.pesoMateria) ||
      // ValidacionUtil.isNullOrEmptyNumber(formValue.notaMinima)
    ) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    etapa = {
      ...etapa,
      nombreEtapa: formValue.nombreEtapa,
      estado: 'ACTIVO',
    };
    this.showLoading = true;
    this.subscriptions.push(
      this.etapasService
        .actualizar(etapa, etapa.codEtapa)
        .subscribe({
          next: () => {
            const index = this.etapas.findIndex(
              (value) => value.codEtapa === etapa.codEtapa
            );
            this.etapas[index] = etapa;
            this.etapas = [...this.etapas];
            this.codigoEtapasEditando = 0;
            this.estaEditando = false;
            this.etapa = this.initObject();
            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Etapa actualizada con éxito'
            );
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

  // eliminar
  confirmarEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.etapasService.eliminar(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Etapa eliminada con éxito'
          );

          this.showLoading = false;
          const index = this.etapas.findIndex(
            (etapa) => etapa.codEtapa === this.codigo
          );
          this.etapas.splice(index, 1);
          this.etapas = [...this.etapas];
          this.showLoading = false;
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
}
