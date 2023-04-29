import { SemestreService } from './../../servicios/semestre.service';
import { Component, OnInit, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { Subscription } from 'rxjs';
import { MdbNotificationRef, MdbNotificationService, } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Notificacion } from 'src/app/util/notificacion';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';
import { Semestre } from 'src/app/modelo/admin/semestre';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { FormArray, FormControl } from '@angular/forms';
import { ComponenteBase } from 'src/app/util/componente-base';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-semestre',
  templateUrl: './semestre.component.html',
  styleUrls: ['./semestre.component.scss'],
})



export class SemestreComponent extends ComponenteBase implements OnInit {
  semestres: Semestre[];
  semestre: Semestre;
  semestreEditForm: Semestre;


  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[] = [];

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  public userResponse: string;

  validacionUtil = ValidacionUtil;

  @ViewChild('table') table!: MdbTableDirective<Semestre>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Semestre'];




  constructor(
    private Api: SemestreService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

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


  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  //actualizar
  public actualizar(semestre: Semestre, formValue): void {

    if(formValue.semestre == ''){
      this.errorNotification('Todos los campos son obligatorios');
      return;
    }

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

  public confirmaEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

public eliminar(): void {
  this.showLoading = true;
  this.subscriptions.push(
    this.Api.eliminarSemestre(this.codigo).subscribe({
      next: () => {
        this.notificacionOK('Semestre eliminada con éxito');
        this.showLoading = false;
        const index = this.semestres.findIndex(semestre => semestre.codSemestre === this.codigo);
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
