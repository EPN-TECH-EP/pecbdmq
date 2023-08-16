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
import {TipoProyecto} from '../../../../modelo/admin/tipo-proyecto';
import {TipoProyectoService} from '../../../../servicios/profesionalizacion/tipo-proyecto.service';

@Component({
  selector: 'app-tipoProyecto',
  templateUrl: './tipo-proyecto.component.html',
  styleUrls: ['./tipo-proyecto.component.scss'],
})
export class TipoProyectoComponent extends ComponenteBase implements OnInit {
  tipoProyectos: TipoProyecto[];
  tipoProyecto: TipoProyecto;
  tipoProyectoEditForm: TipoProyecto;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  codigo: number;
  showLoading = false;
  validacionUtil = ValidacionUtil;
  userResponse: string;

  @ViewChild('table') table!: MdbTableDirective<TipoProyecto>;
  addRow = false;

  headers = [
    'Tipo Proyecto',

  ];

  estaEditando = false;
  codigoTipoProyectoEditando = 0;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private tipoProyectoService: TipoProyectoService,
    private route: ActivatedRoute
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.showLoading = false;

    this.tipoProyectos = [];
    this.subscriptions = [];
    this.tipoProyecto = this.initObject();
    this.tipoProyectoEditForm = this.initObject();
  }

  ngOnInit(): void {
    this.tipoProyectoService.listar().subscribe((data) => {
      this.tipoProyectos = data;
    });
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  editRow(tipoProyecto: TipoProyecto) {
    this.tipoProyectoEditForm = {...tipoProyecto};
    this.codigoTipoProyectoEditando = tipoProyecto.codigo;
  }

  undoRow() {
    this.estaEditando = false;
    this.tipoProyectoEditForm = this.initObject();
  }

  initObject(): TipoProyecto {
    return {
      codigo: 0,
      nombreTipo: '',
      estado: 'ACTIVO',
    };
  }

  crear(tipoProyecto: TipoProyecto): void {
    if (
      tipoProyecto.nombreTipo === '' // ||
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

    tipoProyecto = {...tipoProyecto, estado: 'ACTIVO'};
    this.showLoading = true;
    this.userResponse = 'Lunes';
    this.subscriptions.push(
      this.tipoProyectoService.crear(tipoProyecto).subscribe({
        next: (response: HttpResponse<TipoProyecto>) => {
          const nuevoTipoProyecto: TipoProyecto = response.body;
          this.tipoProyectos.push(nuevoTipoProyecto);
          this.tipoProyectos = [...this.tipoProyectos];
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Tipo Proyecto creada con éxito'
          );

          this.addRow = false;

          this.tipoProyecto = this.initObject();
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

  actualizar(tipoProyecto: TipoProyecto, formValue): void {
    if (
      formValue.nombre === '' ||
      // ValidacionUtil.isNullOrEmptyNumber(formValue.numHoras) ||
      formValue.codTipoProyecto === ''
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

    tipoProyecto = {
      ...tipoProyecto,
      nombreTipo: formValue.nombreTipo,
      estado: 'ACTIVO',
    };
    this.showLoading = true;
    this.subscriptions.push(
      this.tipoProyectoService
        .actualizar(tipoProyecto, tipoProyecto.codigo)
        .subscribe({
          next: () => {
            const index = this.tipoProyectos.findIndex(
              (value) => value.codigo === tipoProyecto.codigo
            );
            this.tipoProyectos[index] = tipoProyecto;
            this.tipoProyectos = [...this.tipoProyectos];
            this.codigoTipoProyectoEditando = 0;
            this.estaEditando = false;
            this.tipoProyecto = this.initObject();
            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Tipo Proyecto actualizada con éxito'
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
      this.tipoProyectoService.eliminar(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Tipo Proyecto eliminada con éxito'
          );

          this.showLoading = false;
          const index = this.tipoProyectos.findIndex(
            (tipoProyecto) => tipoProyecto.codigo === this.codigo
          );
          this.tipoProyectos.splice(index, 1);
          this.tipoProyectos = [...this.tipoProyectos];
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
