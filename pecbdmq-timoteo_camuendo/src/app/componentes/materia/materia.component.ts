import {MateriaService} from './../../servicios/materia.service';
import {MateriasTbl} from './../../modelo/util/materias-tbl';
import {HttpErrorResponse, HttpResponse, HttpClient} from '@angular/common/http';
import {Component, OnInit, OnDestroy, Inject, Injectable} from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {Subscription} from 'rxjs';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';
import {AutenticacionService} from 'src/app/servicios/autenticacion.service';
import {Notificacion} from '../../util/notificacion';
import {ViewChild} from '@angular/core';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {Materia} from 'src/app/modelo/admin/materias';
import {
  MdbPopconfirmRef,
  MdbPopconfirmService,
} from 'mdb-angular-ui-kit/popconfirm';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {ComponenteBase} from 'src/app/util/componente-base';
import {ValidacionUtil} from 'src/app/util/validacion-util';


@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss'],
})
// @Injectable()
// export class MaService {
//   constructor(private valueService: ValueService) { }
//   getValue() { return this.valueService.getValue(); }
// }
export class MateriaComponent extends ComponenteBase implements OnInit {
  materias: Materia[];
  materia: Materia;
  materiaEditForm: Materia;
  public getMaterias: number[] = [];
  public errorMessage: any;

  //private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  validacionUtil = ValidacionUtil;

  public userResponse: string;


  @ViewChild('table') table!: MdbTableDirective<Materia>;
  editElementIndex = -1;
  addRow = false;
  headers = [
    'Nombre Materia',
    'Número de Horas',
    'Tipo de Materia',
    'Observacion Materia',
    'Peso Materia',
    'Nota Mínima',
  ];


  constructor(
    private service: MateriaService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private Api: MateriaService) {

    super(notificationServiceLocal, popconfirmServiceLocal);
    this.showLoading = false;

    this.materias = [];
    this.subscriptions = [];
    this.materia = {
      codMateria: 0,
      nombreMateria: '',
      numHoras: '' as any,
      tipoMateria: '',
      observacionMateria: '',
      pesoMateria: '' as any,
      notaMinima: '' as any,
      estado: 'ACTIVO'
    }
    this.materiaEditForm = {
      codMateria: 0,
      nombreMateria: '',
      numHoras: '' as any,
      tipoMateria: '',
      observacionMateria: '',
      pesoMateria: '' as any,
      notaMinima: '' as any,
      estado: 'ACTIVO'
    }

  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  ngOnInit(): void {
    this.makeAPICall();
    this.Api.getMaterias().subscribe((data) => {
      this.materias = data;
    });
  }

  makeAPICall() {
    Promise.all([this.service.getMaterias()])
      .then((response) => {
        this.parseResponse(response);
      })
      .catch((error) => {
        this.errorMessage = error;
      })
  }


  parseResponse(response: any) {
    if (!response || !Array.isArray(response)) return;
    this.getMaterias = response[0] ? response[0] : [];
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  /*
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

  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }
  */
  public registro(materia: Materia): void {

    if (
      materia.nombreMateria == '' ||
      materia.numHoras == 0 || materia.numHoras < 0 ||
      materia.tipoMateria == '' ||
      materia.observacionMateria == '' ||
      materia.pesoMateria == 0 || materia.pesoMateria < 0 ||
      materia.notaMinima == 0 || materia.notaMinima < 0) {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return
    }

    materia = {...materia, estado: 'ACTIVO'};
    this.showLoading = true;
    this.userResponse = 'Lunes';
    this.subscriptions.push(
      this.Api.registroMateria(materia).subscribe({
        next: (response: HttpResponse<Materia>) => {
          let nuevaMateria: Materia = response.body;
          this.materias.push(nuevaMateria);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Materia creada con éxito');

          this.materia = {
            codMateria: 0,
            nombreMateria: '',
            numHoras: '' as any,
            tipoMateria: '',
            observacionMateria: '',
            pesoMateria: '' as any,
            notaMinima: '' as any,
            estado: 'ACTIVO'
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    )
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.materiaEditForm = {...this.materias[index]};
  }

  undoRow() {
    this.materiaEditForm = {
      codMateria: 0,
      nombreMateria: '',
      numHoras: '' as any,
      tipoMateria: '',
      observacionMateria: '',
      pesoMateria: '' as any,
      notaMinima: '' as any,
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }

  public actualizar(materia: Materia, formValue): void {

    if (
      materia.nombreMateria == '' ||
      materia.numHoras == 0 || materia.numHoras < 0 ||
      materia.tipoMateria == '' ||
      materia.observacionMateria == '' ||
      materia.pesoMateria == 0 || materia.pesoMateria < 0 ||
      materia.notaMinima == 0 || materia.notaMinima < 0) {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return
    }

    materia = {
      ...materia,
      nombreMateria: formValue.nombreMateria,
      numHoras: formValue.numHoras,
      tipoMateria: formValue.tipoMateria,
      observacionMateria: formValue.observacionMateria,
      pesoMateria: formValue.pesoMateria,
      notaMinima: formValue.notaMinima,
      estado: 'ACTIVO'
    }
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarMateria(materia, materia.codMateria).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Materia actualizada con éxito');

          this.materias[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.materia = {
            codMateria: 0,
            nombreMateria: '',
            numHoras: '' as any,
            tipoMateria: '',
            observacionMateria: '',
            pesoMateria: '' as any,
            notaMinima: '' as any,
            estado: 'ACTIVO'
          }
          this.editElementIndex = -1;


          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          };
        },
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
      this.Api.eliminarMateria(this.codigo).subscribe({
        next: (response: string) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Materia eliminada con éxito');

          this.showLoading = false;
          const index = this.materias.findIndex(materia => materia.codMateria === this.codigo);
          this.materias.splice(index, 1);
          this.materias = [...this.materias]
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }
}
