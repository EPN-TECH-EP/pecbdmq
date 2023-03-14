import { Materia } from './../../modelo/materias';
import { MateriasTbl } from './../../modelo/util/materias-tbl';
import { MateriaService } from '../../servicios/materia.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { Subscription } from 'rxjs';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { Notificacion } from '../../util/notificacion';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import {
  MdbPopconfirmRef,
  MdbPopconfirmService,
} from 'mdb-angular-ui-kit/popconfirm';
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
  // CodMateria = '';
  // NombreMateria = '';
  // NumHoras = '' as any;
  // TipoMateria = '';
  // ObservacionMateria = '';
  // PesoMateria = '' as any;
  // NotaMinima = '' as any;
  // Estado ='';
  headers = [
    //'Codigo Materia',
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
    private Api: MateriaService,
    public Valmateria: Materia
  ) {}



  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  ngOnInit(): void {

    this.Valmateria.estado='ACTIVO';
    this.Api.getMaterias().subscribe((data) => {
      this.materias = data;
    });
  }
  editar(index: number){
    this.editElementIndex = index;
    this.Valmateria={...this.materias[index]};

  }
  addNewRow():void {

    const newRow: Materia = {
      codMateria: this.Valmateria.codMateria,
      nombreMateria: this.Valmateria.nombreMateria,
      numHoras: this.Valmateria.numHoras,
      tipoMateria: this.Valmateria.tipoMateria,
      observacionMateria: this.Valmateria.observacionMateria,
      pesoMateria: this.Valmateria.pesoMateria,
      notaMinima: this.Valmateria.notaMinima,
      estado: this.Valmateria.estado,
    };

    this.materias = [...this.materias, { ...newRow }];
    this.Valmateria.codMateria = '';
    this.Valmateria.nombreMateria = '';
    this.Valmateria.numHoras = '' as any;
    this.Valmateria.tipoMateria = '';
    this.Valmateria.observacionMateria = '';
    this.Valmateria.pesoMateria = '' as any;
    this.Valmateria.notaMinima=''as any;
    this.Valmateria.estado = '';


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
    );
  }

  public notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  public registro(materia: Materia): void {
    this.showLoading = true;

      this.Api.registroMateria(materia).subscribe({

        next: (response: HttpResponse<Materia>) => {
           let nuevaMateria: Materia = response.body;
           this.table.data.push(nuevaMateria);

          this.notificacionOK('Materia creada con éxito');

          this.Valmateria.nombreMateria = '';
          this.Valmateria.numHoras = '' as any;
          this.Valmateria.tipoMateria = '';
          this.Valmateria.observacionMateria = '';
          this.Valmateria.pesoMateria = '' as any;
          this.Valmateria.notaMinima = '' as any;
          this.Valmateria.estado = '';
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          //  this.showLoading = false;
        },
      })
   }

  public actualizar(materia: Materia, codMateria: any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarMateria(materia, codMateria).subscribe({
        next: (response: HttpResponse<Materia>) => {
          let actualizaUnidad: Materia = response.body;
          this.notificacionOK('Materia actualizada con éxito');

          this.editElementIndex = -1;

          this.Valmateria.nombreMateria = '';
          this.Valmateria.numHoras = '' as any;
          this.Valmateria.tipoMateria = '';
          this.Valmateria.observacionMateria = '';
          this.Valmateria.pesoMateria = '' as any;
          this.Valmateria.notaMinima = '' as any;
          this.Valmateria.estado = '';
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
            // this.showLoading = false;
          };
        },
      })
    );
  }
  // public eliminar(codMateria: any): void {
  //   this.showLoading = true;
  //   this.subscriptions.push(
  //     this.Api.eliminarMateria(codMateria).subscribe({
  //       next: (response: string) => {


  //         this.notificacionOK('Materia eliminada con éxito');
  //         const index = this.materias.indexOf(codMateria);
  //         this.materias.splice(index, 1);
  //         this.materias = [...this.materias];
  //       },
  //       error: (errorResponse: HttpErrorResponse) => {
  //         this.notificacion(errorResponse);
  //         console.log(errorResponse);
  //       },
  //     })
  //   );
  // }

  public eliminar(Codigo: any, data: Materia): void {
  this.showLoading = true;
  this.subscriptions.push(
    this.Api.eliminarMateria(Codigo).subscribe({
      next: (response: string) => {
        this.notificacionOK('Materia eliminada con éxito');
        const index = this.materias.indexOf(data);
        this.materias.splice(index, 1);
        this.materias = [...this.materias]
        this.showLoading = false;
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
        console.log(errorResponse);
        this.showLoading = false;
      },
    })
  );
}
}
