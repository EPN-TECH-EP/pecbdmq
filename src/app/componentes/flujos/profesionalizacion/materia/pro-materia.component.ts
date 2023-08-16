import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MdbNotificationRef, MdbNotificationService,} from 'mdb-angular-ui-kit/notification';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {Materia} from '../../../../modelo/admin/materias';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ComponenteBase} from '../../../../util/componente-base';
import {ValidacionUtil} from '../../../../util/validacion-util';
import {AlertaComponent} from '../../../util/alerta/alerta.component';

import {ActivatedRoute} from '@angular/router';
import {Notificacion} from '../../../../util/notificacion';
import {EjeMateriaDto} from "../../../../modelo/flujos/profesionalizacion/eje-materia.models";
import { ProMateriaService } from '../../../../servicios/profesionalizacion/pro-materia.service';

@Component({
  selector: 'app-materia',
  templateUrl: './pro-materia.component.html',
  styleUrls: ['./pro-materia.component.scss'],
})
export class ProMateriaComponent extends ComponenteBase implements OnInit {
  materias: Materia[];
  materia: Materia;
  materiaEditForm: Materia;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  codigo: number;
  showLoading = false;
  validacionUtil = ValidacionUtil;
  userResponse: string;

  @ViewChild('table') table!: MdbTableDirective<Materia>;
  addRow = false;

  headers = [
    'Nombre Materia',
    'Eje de Materia',
    'Es Proyecto?'
  ];

  estaEditando = false;
  codigoMateriaEditando = 0;
  ejeMateriaList: EjeMateriaDto[];

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private materiaService: ProMateriaService,
    private route: ActivatedRoute
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);
    const module = this.route.snapshot.data.module;

    this.showLoading = false;

    this.materias = [];
    this.subscriptions = [];
    this.materia = this.initObject();
    this.materiaEditForm = this.initObject();
  }

  ngOnInit(): void {
    this.materiaService.listar().subscribe((data) => {
      this.materias = data;
    });

    this.materiaService.ejeMaterias().subscribe((data)=>{
      this.ejeMateriaList = data;
    })
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  editRow(materia: Materia) {
    this.materiaEditForm = {...materia};
    this.codigoMateriaEditando = materia.codMateria;
  }

  undoRow() {
    this.estaEditando = false;
    this.materiaEditForm = this.initObject();
  }

  initObject(): Materia {
    return {
      codMateria: 0,
      nombre: '',
      codEjeMateria: 1,
      estado: 'ACTIVO',
      esProyecto: false
    };
  }

  getEjeMateria(codigo: number){
    return this.ejeMateriaList.find(value => value.coddEjeMateria==codigo).nombreEjeMateria;
  }

  crear(materia: Materia): void {
    if (
      materia.nombre === '' || materia.codEjeMateria == null || materia.codEjeMateria===0
    ) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    materia = {...materia, estado: 'ACTIVO'};
    this.showLoading = true;
    this.userResponse = 'Lunes';
    this.subscriptions.push(
      this.materiaService.crear(materia).subscribe({
        next: (response: HttpResponse<Materia>) => {
          const nuevaMateria: Materia = response.body;
          this.materias.push(nuevaMateria);
          this.materias = [...this.materias];
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Materia creada con éxito'
          );

          this.addRow = false;

          this.materia = this.initObject();
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

  actualizar(materia: Materia, formValue): void {
    if (
      formValue.nombre === '' ||
      formValue.codEjeMateria === ''
    ) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    materia = {
      ...materia,
      nombre: formValue.nombre,
      codEjeMateria: formValue.codEjeMateria,
      estado: 'ACTIVO',
      esProyecto: formValue.esProyecto
    };
    this.showLoading = true;
    this.subscriptions.push(
      this.materiaService
        .actualizar(materia, materia.codMateria)
        .subscribe({
          next: () => {
            const index = this.materias.findIndex(
              (value) => value.codMateria === materia.codMateria
            );
            this.materias[index] = materia;
            this.materias = [...this.materias];
            this.codigoMateriaEditando = 0;
            this.estaEditando = false;
            this.materia = this.initObject();
            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Materia actualizada con éxito'
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
      this.materiaService.eliminar(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Materia eliminada con éxito'
          );

          this.showLoading = false;
          const index = this.materias.findIndex(
            (materia) => materia.codMateria === this.codigo
          );
          this.materias.splice(index, 1);
          this.materias = [...this.materias];
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
