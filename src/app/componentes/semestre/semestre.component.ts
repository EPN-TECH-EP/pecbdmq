import { SemestreService } from './../../servicios/semestre.service';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { UnidadGestion } from 'src/app/modelo/unidad-gestion';
import { UnidadGestionService } from 'src/app/servicios/unidad-gestion.service';
import { Subscription } from 'rxjs';
import { MdbNotificationRef, MdbNotificationService, } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Notificacion } from 'src/app/util/notificacion';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { Semestre } from 'src/app/modelo/semestre';
import { HeaderType } from 'src/app/enum/header-type.enum';
@Component({
  selector: 'app-semestre',
  templateUrl: './semestre.component.html',
  styleUrls: ['./semestre.component.scss']
})
export class SemestreComponent implements OnInit {
  semestres: Semestre[];
  semestre: Semestre;
  semestreEditForm: Semestre;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[] = [];
  public showLoading: boolean;



  @ViewChild('table') table!: MdbTableDirective<UnidadGestion>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Semestre'];


  constructor(
    private Api: SemestreService,
    private notificationService: MdbNotificationService,
  ) {
    this.semestres= [];
    this.subscriptions = [];
    this.semestre = {
      codSemestre:0,
      semestre:'',
      estado:'ACTIVO'
    }
    this.semestreEditForm = {
      codSemestre: 0,
      semestre:'',
      estado:'ACTIVO'
    };
  }

  ngOnInit(): void {
    this.Api.getSemestre().subscribe(data => {
      this.semestres = data;
    })
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
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
  //registro
  public registro(semestre: Semestre): void {
    semestre={...semestre, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crearSemestre(semestre).subscribe({
        next: (response: HttpResponse<Semestre>) => {
          let nuevaSemestre: Semestre = response.body;
          this.semestres.push(nuevaSemestre);
          this.notificacionOK('Semestre creada con éxito');
          this.semestre ={
          codSemestre: 0,
          semestre:'',
          estado: 'ACTIVO'
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.semestreEditForm = {...this.semestres[index]};
  }

  undoRow() {
    this.semestreEditForm = {
      codSemestre: 0,
      semestre:'',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }



  //actualizar
  public actualizar(semestre: Semestre, formValue): void {

    semestre={...semestre, semestre: formValue.semestre, estado:'ACTIVO'}
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarSemestre(semestre, semestre.codSemestre).subscribe({
      next: (response) => {
        this.notificacionOK('Semestre actualizada con éxito');
        this.semestres[this.editElementIndex] = response.body;
        this.showLoading = false;
        this.semestre ={
          codSemestre: 0,
          semestre:'',
          estado: 'ACTIVO'
          }
        this.editElementIndex=-1;
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
      },
    })
    );
  }

  //eliminar

public eliminar(codSemestre: number): void {
  this.showLoading = true;
  this.subscriptions.push(
    this.Api.eliminarSemestre(codSemestre).subscribe({
      next: () => {
        this.notificacionOK('Semestre eliminada con éxito');
        this.showLoading = false;
        const index = this.semestres.findIndex(semestre => semestre.codSemestre === codSemestre);
        this.semestres.splice(index, 1);
        this.semestres = [...this.semestres]
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
        console.log(errorResponse);
      },
    })
  );
}

}
