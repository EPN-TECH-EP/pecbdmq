import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {Subscription} from 'rxjs';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {Aula} from 'src/app/modelo/admin/aula';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';
import {AulaService} from 'src/app/servicios/aula.service';
import {Notificacion} from '../../util/notificacion';
import {AlertaComponent} from '../util/alerta/alerta.component';


@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.scss']
})
export class AulasComponent implements OnInit {
  //model
  aulas: Aula[];
  aula: Aula;
  aulaEditForm: Aula;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[] = [];
  public showLoading: boolean;


  //table
  @ViewChild('table') table!: MdbTableDirective<Aula>;
  editElementIndex = -1;
  addRow = false;

  headers = [
    'Nombre',
    'Capacidad',
    'Tipo',
    'Sala Ocupada',
  ];

  constructor(
    private notificationService: MdbNotificationService,
    private Api: AulaService) {
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
      salaOcupada: ''
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
      salaOcupada: ''
    };
  }

  ngOnInit(): void {
    this.Api.getAula().subscribe(data => {
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


  public notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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

    if (codigoError === 0) {
      mensajeError = 'Error de conexión al servidor';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    )
  }

  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  public registro(aula: Aula): void {

    if (
      aula.nombre == '' ||
      aula.capacidad == 0 || aula.capacidad < 0 ||
      aula.salaOcupada == '' ||
      aula.tipo == 0
    ) {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    aula = {...aula, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.registroAula(aula).subscribe({
        next: (response: HttpResponse<Aula>) => {
          let nuevaAula: Aula = response.body;
          this.aulas.push(nuevaAula);
          this.notificacionOK('Aula creada con éxito');
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
            salaOcupada: ''
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    )
  }

  editar(index: number) {
    this.editElementIndex = index;
    this.aulaEditForm = {...this.aulas[index]};
  }

  undoRow() {
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
      salaOcupada: ''
    };
    this.editElementIndex = -1;
  }


  public actualizar(aula: Aula, formValue): void {

    if (
      formValue.nombre == '' ||
      formValue.capacidad == 0 || formValue.capacidad < 0 ||
      formValue.salaOcupada == '' ||
      formValue.tipo == 0
    ) {
      this.errorNotification('Todos los campos deben estar llenos');
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
      this.Api.actualizarAula(aula, aula.codigo).subscribe({
        next: (response) => {
          this.notificacionOK('Aula actualizada con éxito');
          this.aulas[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.aula = {
            codigo: 0,
            nombre: '',
            capacidad: '' as any,
            tipo: '' as any,
            pcs: '',
            impresoras: '',
            internet: '',
            proyectores: '' as any,
            instructor: '' as any,
            salaOcupada: '',
            estado: 'ACTIVO'
          }
          this.editElementIndex = -1;

          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
          };
        },
      })
    );
  }


  public eliminar(codigo: number): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminarAula(codigo).subscribe({
        next: () => {
          this.notificacionOK('Semestre eliminada con éxito');
          this.showLoading = false;
          const index = this.aulas.findIndex(aula => aula.codigo === codigo);
          this.aulas.splice(index, 1);
          this.aulas = [...this.aulas]
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }


}


