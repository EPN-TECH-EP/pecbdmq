import { MateriaService } from '../../servicios/materia.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { Notificacion } from '../../util/notificacion';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { Materia } from 'src/app/modelo/admin/materias';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { ComponenteBase } from 'src/app/util/componente-base';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss'],
})
export class MateriaComponent extends ComponenteBase implements OnInit {
  materias: Materia[];
  materia: Materia;
  materiaEditForm: Materia;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  validacionUtil = ValidacionUtil;
  userResponse: string;

  @ViewChild('table') table!: MdbTableDirective<Materia>;
  addRow = false;
  headers = [
    'Nombre Materia',
    'Número de Horas',
    'Tipo de Materia',
    'Observacion Materia',
    'Peso Materia',
    'Nota Mínima',
  ];

  estaEditando = false;
  codigoMateriaEditando = 0;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private materiaService: MateriaService
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);
    this.showLoading = false;

    this.materias = [];
    this.subscriptions = [];
    this.materia = this.initObject(); /*{
      codMateria: 0,
      nombre: '',
      numHoras: 1,
      tipoMateria: '',
      observacionMateria: '',
      pesoMateria: 1,
      notaMinima: 1,
      estado: 'ACTIVO'
    }*/
    this.materiaEditForm = this.initObject(); /*{
      codMateria: 0,
      nombre: '',
      numHoras: 1,
      tipoMateria: '',
      observacionMateria: '',
      pesoMateria: 1,
      notaMinima: 1,
      estado: 'ACTIVO'
    }*/
  }

  ngOnInit(): void {
    this.materiaService.getMaterias().subscribe((data) => {
      this.materias = data;
    });
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  editRow(materia: Materia) {
    this.materiaEditForm = { ...materia };
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
      numHoras: 1,
      tipoMateria: '',
      observacionMateria: '',
      pesoMateria: 1,
      notaMinima: 1,
      estado: 'ACTIVO',
    };
  }

  crear(materia: Materia): void {
    if (
      materia.nombre == '' ||
      ValidacionUtil.isNullOrEmptyNumber(materia.numHoras) ||
      materia.tipoMateria == '' ||
      materia.observacionMateria == '' ||
      ValidacionUtil.isNullOrEmptyNumber(materia.pesoMateria) ||
      ValidacionUtil.isNullOrEmptyNumber(materia.notaMinima)
    ) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    materia = { ...materia, estado: 'ACTIVO' };
    this.showLoading = true;
    this.userResponse = 'Lunes';
    this.subscriptions.push(
      this.materiaService.registroMateria(materia).subscribe({
        next: (response: HttpResponse<Materia>) => {
          let nuevaMateria: Materia = response.body;
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
      formValue.nombre == '' ||
      ValidacionUtil.isNullOrEmptyNumber(formValue.numHoras) ||
      formValue.tipoMateria == '' ||
      formValue.observacionMateria == '' ||
      ValidacionUtil.isNullOrEmptyNumber(formValue.pesoMateria) ||
      ValidacionUtil.isNullOrEmptyNumber(formValue.notaMinima)
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
      numHoras: formValue.numHoras,
      tipoMateria: formValue.tipoMateria,
      observacionMateria: formValue.observacionMateria,
      pesoMateria: formValue.pesoMateria,
      notaMinima: formValue.notaMinima,
      estado: 'ACTIVO',
    };
    this.showLoading = true;
    this.subscriptions.push(
      this.materiaService
        .actualizarMateria(materia, materia.codMateria)
        .subscribe({
          next: () => {
            let index = this.materias.findIndex(
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

  // eliminar
  confirmarEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.materiaService.eliminarMateria(this.codigo).subscribe({
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
