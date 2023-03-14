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

  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  semestres: Semestre[];
  public showLoading: boolean;

  constructor(
    private Api: SemestreService,
    private notificationService: MdbNotificationService,
    public Valsemestre: Semestre
  ) { }

  @ViewChild('table') table!: MdbTableDirective<UnidadGestion>;
  editElementIndex = -1;
  addRow = false;

  headers = ['Semestre'];

  // addNewRow() {
  //   const newRow: Semestre = {
  //     codSemestre: this.Valsemestre.codSemestre,
  //     semestre: this.Valsemestre.semestre,
  //   }
  //   this.semestres = [...this.semestres, { ...newRow }];
  //   this.Valsemestre.codSemestre = ''as any;
  //   this.Valsemestre.semestre = '';
  // }

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
          this.Valsemestre.semestre = '';

        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }

  //actualizar
  public actualizar(semestre: Semestre, CodSemestre:any): void {
    semestre={...semestre, estado:'ACTIVO'};

    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarSemestre(semestre, CodSemestre).subscribe({
      next: (response: HttpResponse<Semestre>) => {
        let actualizaUnidad: Semestre = response.body;
        this.notificacionOK('Semestre actualizada con éxito');
        this.editElementIndex=-1;
        this.showLoading = false;

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
        this.notificacionOK('Semestre eliminada con éxito');
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
