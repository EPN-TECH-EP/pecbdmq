import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MdbNotificationRef, MdbNotificationService,} from 'mdb-angular-ui-kit/notification';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ComponenteBase} from 'src/app/util/componente-base';
import {ValidacionUtil} from 'src/app/util/validacion-util';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {Notificacion} from '../../../../util/notificacion';
import {TipoProyectoService} from '../../../../servicios/profesionalizacion/tipo-proyecto.service';
import {Proyecto} from '../../../../modelo/admin/profesionalizacion/pro-proyecto';
import {ProProyectoService} from '../../../../servicios/profesionalizacion/pro-proyecto.service';
import {TipoProyecto} from '../../../../modelo/admin/tipo-proyecto';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {defaultTo} from 'lodash';


@Component({
  selector: 'app-proyecto',
  templateUrl: './pro-proyecto.component.html',
  styleUrls: ['./pro-proyecto.component.scss'],
})
export class ProyectoComponent extends ComponenteBase implements OnInit {
  proyectos: Proyecto[];
  proyecto: Proyecto;
  proyectoEditForm: Proyecto;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  codigo: number;
  showLoading = false;
  validacionUtil = ValidacionUtil;
  tipoProyectoList: TipoProyecto[];
  formGroup: FormGroup;

  @ViewChild('table') table!: MdbTableDirective<Proyecto>;
  addRow = false;

  headers = [
    'Nombre de Proyecto',
    'Tipo de Proyecto',
  ];

  estaEditando = false;
  codigoProyectoEditando = 0;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private proyectoService: ProProyectoService,
    private builder: FormBuilder,
    private tipoProyectoService: TipoProyectoService,
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);
    this.showLoading = false;
    this.proyectos = [];
    this.subscriptions = [];
    this.proyecto = this.initObject();
    this.proyectoEditForm = this.initObject();
    this.formGroup = new FormGroup({});
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.proyectoService.listar().subscribe((data) => {
      this.proyectos = data;
    });
    this.tipoProyectoService.listar().subscribe(resp=> this.tipoProyectoList = resp );
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  editRow(proyecto: Proyecto) {
    this.proyectoEditForm = {...proyecto};
    this.codigoProyectoEditando = proyecto.codigo;
    this.matchDatosItemEnFormulario();
  }

  undoRow() {
    this.estaEditando = false;
    this.proyectoEditForm = this.initObject();
  }

  initObject(): Proyecto {
    return {
      codigo: 0,
      nombreCatalogo: '',
      codigoTipoProyecto: 0,
      estado: 'ACTIVO',
    };
  }

  crear(): void {
    const proyecto = this.formGroup.value;
    console.log(proyecto);
    if (proyecto.nombreCatalogo === '') {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    console.log('hey')
    console.log(proyecto)
    this.showLoading = true;
    this.subscriptions.push(
      this.proyectoService.crear(proyecto).subscribe({
        next: (response: HttpResponse<Proyecto>) => {
          const newProject: Proyecto = response.body;
          this.proyectos.push(newProject);
          this.proyectos = [...this.proyectos];
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Proyecto creado con éxito'
          );

          this.addRow = false;

          this.proyecto = this.initObject();
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

  actualizar(proyecto: Proyecto, formValue): void {
    if (
      formValue.nombreCatalogo === '' ||
      !formValue.codigoTipoProyecto) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    proyecto = {
      ...proyecto,
      nombreCatalogo: formValue.nombreCatalogo,
      codigoTipoProyecto: formValue.codigoTipoProyecto,
      estado: 'ACTIVO',
    };
    this.showLoading = true;
    this.subscriptions.push(
      this.proyectoService
        .actualizar(proyecto, proyecto.codigo)
        .subscribe({
          next: () => {
            const index = this.proyectos.findIndex(
              (value) => value.codigo === proyecto.codigo
            );
            this.proyectos[index] = proyecto;
            this.proyectos = [...this.proyectos];
            this.codigoProyectoEditando = 0;
            this.estaEditando = false;
            this.proyecto = this.initObject();
            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Proyecto actualizado con éxito'
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

  confirmarEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.proyectoService.eliminar(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Proyecto eliminado con éxito'
          );

          this.showLoading = false;
          const index = this.proyectos.findIndex(
            (proyecto) => proyecto.codigo === this.codigo
          );
          this.proyectos.splice(index, 1);
          this.proyectos = [...this.proyectos];
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

  onCancel() {
    this.addRow = false
    this.formGroup.reset();
  }

  private construirFormulario() {
    this.formGroup = this.builder.group({
      nombreCatalogo: ['', Validators.required],
      codigoTipoProyecto: ['', Validators.required],
      estado: ['ACTIVO', Validators.required],
    })
  }

  private matchDatosItemEnFormulario() {
    console.log(this.proyectoEditForm)
    this.formGroup.patchValue({
      nombreCatalogo:this.proyectoEditForm.nombreCatalogo,
      codigoTipoProyecto: this.proyectoEditForm.codigoTipoProyecto,
      estado: 'ACTIVO',
    })
  }

  getProyectLabel(idTipo: number) {
    return defaultTo(this.tipoProyectoList?.find(el=> el.codigo === idTipo)?.nombreTipo, '')
  }
}
