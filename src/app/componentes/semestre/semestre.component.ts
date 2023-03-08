import { SemestreService } from './../../servicios/semestre.service';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { UnidadGestion } from 'src/app/modelo/unidad_gestion';
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

  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  semestres: Semestre[];
  public showLoading: boolean;

  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];
  constructor(
    private Api: SemestreService,
    private notificationService: MdbNotificationService
  ) { }

  @ViewChild('table') table!: MdbTableDirective<UnidadGestion>;
  editElementIndex = -1;
  addRow = false;
  CodSemestre = '' as any;
  Semestre = '';
  Estado = 'ACTIVO';
  headers = ['Semestre', 'Estado'];

  // addNewRow() {
  //   const newRow: Semestre = {
  //     codSemestre: this.CodSemestre,
  //     semestre: this.Semestre,
  //     estado: this.Estado,
  //   }
  //   this.semestres = [...this.semestre, { ...newRow }];
  //   this.CodSemestre = '' as any;
  //   this.Semestre = '';
  //   this.Estado = 'ACTIVO';
  // }

  ngOnInit(): void {
    this.Api.getSemestre().subscribe(data => {
      this.semestres = data;
    })
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


  public notificacionOk(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }
  //registro
  public registro(semestre: Semestre): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crearSemestre(semestre).subscribe({
        next: (response: HttpResponse<Semestre>) => {
          let nuevaSemestre: Semestre = response.body;
          this.semestres.push(nuevaSemestre);
          this.notificacionOk('Semestre creada con éxito');
          this.Semestre = '';
          this.Estado ='';
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }

  //actualizar
  public actualizar(semestre: Semestre, CodSemestre:any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarSemestre(semestre, CodSemestre).subscribe({
      next: (response: HttpResponse<Semestre>) => {
        let actualizaUnidad: Semestre = response.body;
        this.notificacionOk('Semestre actualizada con éxito');
        this.editElementIndex=-1;
        this.showLoading = false;
        this.Semestre = '';
        this.Estado ='';
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
        this.showLoading = false;
      },
    })
    );
  }

  //eliminar

public eliminar(CodSemestre: any, data: Semestre): void {
  this.showLoading = true;
  this.subscriptions.push(
    this.Api.eliminarSemestre(CodSemestre).subscribe({
      next: (response: string) => {
        this.notificacionOk('Semestre eliminada con éxito');
        const index = this.semestres.indexOf(data);
        this.semestres.splice(index, 1);
        this.semestres = [...this.semestres]
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
