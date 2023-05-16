import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {Aula} from 'src/app/modelo/admin/aula';
import {AulaService} from 'src/app/servicios/aula.service';
import {Notificacion} from '../../util/notificacion';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {ComponenteBase} from 'src/app/util/componente-base';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ValidacionUtil} from 'src/app/util/validacion-util';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.scss']
})
export class AulasComponent extends ComponenteBase implements OnInit {

  aulas: Aula[];
  aula: Aula;
  aulaEditForm: Aula;
  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  validacionUtil = ValidacionUtil;
  @ViewChild('table') table!: MdbTableDirective<Aula>;
  addRow = false;
  headers = [
    'Nombre',
    'Capacidad',
    'Tipo',
    'Sala Ocupada',
  ];

  estaEditando = false;
  codigoAulaEditando = 0;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private aulaService: AulaService) {
    super(notificationServiceLocal, popConfirmServiceLocal);
    this.showLoading = false;

    this.aulas = [];
    this.subscriptions = [];
    this.aula = {
      codigo: 0,
      estado: '',
      nombre: '',
      capacidad: '' as any,
      tipo: '' as any,
      pcs: '',
      impresoras: '',
      internet: '',
      proyectores: '' as any,
      instructor: '' as any,
      salaOcupada: false
    }
    this.aulaEditForm = {
      codigo: 0,
      estado: '',
      nombre: '',
      capacidad: '' as any,
      tipo: '' as any,
      pcs: '',
      impresoras: '',
      internet: '',
      proyectores: '' as any,
      instructor: '' as any,
      salaOcupada: false
    };
  }

  ngOnInit(): void {
    this.aulaService.getAula().subscribe(data => {
      this.aulas = data;
      this.aulas.forEach((aula) => {
        delete aula.pcs;
        delete aula.impresoras;
        delete aula.internet;
        delete aula.proyectores;
        delete aula.instructor;
      })
    });
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }


  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  public crear(aula: Aula): void {

    if (
      aula.nombre == '' ||
      ValidacionUtil.isNullOrEmptyNumber(aula.capacidad) ||
      aula.tipo == 0
    ) {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }

    aula = {...aula, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.aulaService.registroAula(aula).subscribe({
        next: (response: HttpResponse<Aula>) => {
          let nuevaAula: Aula = response.body;
          this.aulas.push(nuevaAula);
          this.aulas = [...this.aulas]
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Aula creada con éxito');
          this.aula = {
            codigo: 0,
            estado: '',
            nombre: '',
            capacidad: '' as any,
            tipo: '' as any,
            pcs: '',
            impresoras: '',
            internet: '',
            proyectores: '' as any,
            instructor: '' as any,
            salaOcupada: false
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    )
  }

  editRow(aula: Aula) {
    this.aulaEditForm = {...aula}
    this.codigoAulaEditando = aula.codigo;
  }

  undoRow() {
    this.estaEditando = false;
    this.aulaEditForm = {
      codigo: 0,
      estado: '',
      nombre: '',
      capacidad: '' as any,
      tipo: '' as any,
      pcs: '',
      impresoras: '',
      internet: '',
      proyectores: '' as any,
      instructor: '' as any,
      salaOcupada: false
    };
  }

  public actualizar(aula: Aula, formValue): void {

    if (
      formValue.nombre == '' ||
      ValidacionUtil.isNullOrEmptyNumber(formValue.capacidad) ||
      formValue.tipo == 0
    ) {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }

    aula = {
      ...aula,
      nombre: formValue.nombre,
      capacidad: formValue.capacidad,
      tipo: formValue.tipo,
      pcs: formValue.pcs,
      impresoras: formValue.impresoras,
      internet: formValue.internet,
      proyectores: formValue.proyectores,
      instructor: formValue.instructor,
      salaOcupada: formValue.salaOcupada,
      estado: 'ACTIVO'
    }


    this.showLoading = true;
    this.subscriptions.push(
      this.aulaService.actualizarAula(aula, aula.codigo).subscribe({
        next: () => {
          let index = this.aulas.findIndex(value => value.codigo == aula.codigo);
          this.aulas[index] = aula;
          this.aulas = [...this.aulas];
          this.codigoAulaEditando = 0;
          this.estaEditando = false;
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Aula actualizada con éxito');
        },

        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        }

      })
    );
  }

// eliminar
  public confirmaEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }


  public eliminar(): void {

    this.showLoading = true;
    this.subscriptions.push(
      this.aulaService.eliminarAula(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Aula eliminada con éxito');
          this.showLoading = false;
          const index = this.aulas.findIndex(aula => aula.codigo === this.codigo);
          this.aulas.splice(index, 1);
          this.aulas = [...this.aulas]
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

}


