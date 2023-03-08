import { MateriaService } from '../../servicios/materia.service';
import { Materia } from '../../modelo/materias';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import { Subscription } from 'rxjs';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { Notificacion } from '../../util/notificacion';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef,MdbPopconfirmService,} from 'mdb-angular-ui-kit/popconfirm';
import { AlertaComponent } from '../util/alerta/alerta.component';

@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss'],
})
export class MateriaComponent implements OnInit {
  materias: Materia[];

  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  public showLoading: boolean;
  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];

  @ViewChild('table') table!: MdbTableDirective<Materia>;

  editElementIndex = -1;
  addRow = false;
  CodMateria = '';
  NombreMateria = '';
  NumHoras = '' as any;
  TipoMateria = '';
  ObservacionMateria = '';
  PesoMateria = '' as any;
  NotaMinima = '' as any;
  Estado ='';
  headers = [
    // 'Codigo Materia',
    'Nombre Materia',
    'Número de Horas',
    'Tipo de Materia',
    'Observacion Materia',
    'Peso Materia',
    'Nota Mínima',
    'Estado',
  ];



  constructor(
    // public materiaEnviar: Materia,
    private notificationService: MdbNotificationService,
    private Api: MateriaService
  ) {}



  limpiar() {
    this.NombreMateria = '';
    this.NumHoras = '';
    this.TipoMateria = '';
    this.ObservacionMateria = '';
    this.PesoMateria = '';
    this.NotaMinima = '';
    this.Estado ='';
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }
  onDeleteClick(data: Materia) {
    const index = this.materias.indexOf(data);
    this.materias.splice(index, 1);
    this.materias = [...this.materias]
  }

  ngOnInit(): void {
    this.Api.getMaterias().subscribe(data => {
      this.materias = data;
    });
  }
  addNewRow() {
    const newRow: Materia = {
      codMateria: this.CodMateria,
      nombreMateria: this.NombreMateria,
      numHoras: this.NumHoras,
      tipoMateria: this.TipoMateria,
      observacionMateria: this.ObservacionMateria,
      pesoMateria: this.PesoMateria,
      notaMinima: this.NotaMinima,
      estado: this.Estado,
      // estadoMateria: this.EstadoMateria,
    };

    this.materias = [...this.materias, { ...newRow }];
    this.CodMateria = '';
    this.NombreMateria = '';
    this.NumHoras = '';
    this.TipoMateria = '';
    this.ObservacionMateria = '';
    this.PesoMateria = '';
    this.Estado =";"

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

  public notificacionOK(mensaje:string){
    this.notificationRef = Notificacion.notificar(
    this.notificationService,
    mensaje,
    TipoAlerta.ALERTA_OK
    );
  }

  public registro(materia: Materia): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.registroMateria(materia).subscribe({
        next: (response: HttpResponse<Materia>) => {
          let nuevaMateria: Materia = response.body;
          this.table.data.push(nuevaMateria);
          this.notificacionOK('Materia creada con éxito');
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          //  this.showLoading = false;
        },
      })
    );
  }


  public actualizar(materia: Materia, codMateria:any): void {
   this.showLoading = true;
   this.subscriptions.push(
     this.Api.actualizarMateria(materia,codMateria).subscribe({
     next: (response: HttpResponse<Materia>) => {
       let actualizaUnidad: Materia = response.body;
        this.notificacionOK('Materia actualizada con éxito');
        this.editElementIndex=-1;

     error: (errorResponse: HttpErrorResponse) => {
       this.notificacion(errorResponse);
        // this.showLoading = false;
     }
      },
    })
    );
  }
  public eliminar(codMateria: any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminarMateria(codMateria).subscribe({
        next: (response: string) => {
          this.notificacionOK('Materia eliminada con éxito');
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          console.log(errorResponse);
        },
      })
    );
  }
}




















