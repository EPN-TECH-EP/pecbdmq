import { Convocatoria } from './../../modelo/convocatoria';
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
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { Semestre } from 'src/app/modelo/semestre';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { FormArray, FormControl } from '@angular/forms';
import { ConvocatoriaService } from 'src/app/servicios/convocatoria.service';
@Component({
  selector: 'app-aconvocatoria',
  templateUrl: './aconvocatoria.component.html',
  styleUrls: ['./aconvocatoria.component.scss']
})
export class AconvocatoriaComponent implements OnInit {
  convocatorias: Convocatoria[];
  convocatoria: Convocatoria;
  convocatoriaEditForm: Convocatoria;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[] = [];
  public showLoading: boolean;
  public userResponse: string;

  @ViewChild('table') table!: MdbTableDirective<Semestre>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Código','FechaInicio','FechaFin','HoraInicio','HoraFin','Cupos Hombre','Cupos Mujer'];




  constructor(private Api: ConvocatoriaService,
    private notificationService: MdbNotificationService,) {
      this.convocatorias= [];
      this.subscriptions = [];
      this.convocatoria = {
        codConvocatoria: 0,
        codPeriodoEvaluacion: 0,
        codPeriodoAcademico:0,
        nombre:'',
        estado: '',
        fechaInicioConvocatoria: '',
        fechaFinConvocatoria: '',
        horaInicioConvocatoria: '',
        horaFinConvocatoria: '',
        codigoUnico: 0,
        cupoHombres:0,
        cupoMujeres: 0,
        correo: '',
        documentos: '',
        requisitos: ''

      }
      this.convocatoriaEditForm = {
        codConvocatoria: 0,
        codPeriodoEvaluacion: 0,
        codPeriodoAcademico:0,
        nombre:'',
        estado: '',
        fechaInicioConvocatoria: '',
        fechaFinConvocatoria: '',
        horaInicioConvocatoria: '',
        horaFinConvocatoria: '',
        codigoUnico: 0,
        cupoHombres:0,
        cupoMujeres: 0,
        correo: '',
        documentos: '',
        requisitos: ''

      };
     }

     ngOnInit(): void {
      this.Api.getConvocatoria().subscribe(data => {
        this.convocatorias = data;
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

    editRow(index: number) {
      this.editElementIndex = index;
      this.convocatoriaEditForm = {...this.convocatorias[index]};
    }

    undoRow() {
      this.convocatoriaEditForm = {
        codConvocatoria: 0,
        codPeriodoEvaluacion: 0,
        codPeriodoAcademico:0,
        nombre:'',
        estado: '',
        fechaInicioConvocatoria: '',
        fechaFinConvocatoria: '',
        horaInicioConvocatoria: '',
        horaFinConvocatoria: '',
        codigoUnico: 0,
        cupoHombres:0,
        cupoMujeres: 0,
        correo: '',
        documentos: '',
        requisitos: ''

      }
      this.editElementIndex = -1;
    }



    public actualizar(convocatoria: Convocatoria, formValue): void {
      convocatoria={...convocatoria,
        codConvocatoria: formValue.codConvocatoria,
        codPeriodoEvaluacion: formValue.codPeriodoEvaluacion,
        codPeriodoAcademico: formValue.codPeriodoAcademico,
        nombre: formValue.nombre,
        fechaInicioConvocatoria: formValue.fechaInicioConvocatoria,
        fechaFinConvocatoria: formValue.fechaFinConvocatoria,
        horaInicioConvocatoria: formValue.horaInicioConvocatoria,
        horaFinConvocatoria: formValue.horaFinConvocatoria,
        codigoUnico: formValue.codigoUnico,
        cupoHombres: formValue.cupoHombres,
        cupoMujeres: formValue.cupoMujeres,
         estado:'ACTIVO'
      }
     this.showLoading = true;
     this.subscriptions.push(
       this.Api.actualizarConvocatoria(convocatoria, convocatoria.codConvocatoria).subscribe({
       next: (response) => {
        this.notificacionOK('Convocatoria actualizada con éxito');
       this.convocatorias[this.editElementIndex] = response.body;
          this.showLoading = false;
        //   this.convocatoria = {
        //     codConvocatoria: 0,
        //     codModulo: 0,
        //     codPeriodoAcademico: 0,
        //     codigo_convocatoria: 0,
        //     fechaInicio: 0,
        //     fechaFin: 0,
        //     horaInicio: 0,
        //     horaFin: 0,
        //     cuposHombre: '',
        //     cuposMujeres: '',
        //     correo: '',
        //     codPeriodoEvaluación: 0,
        //     estado: 'ACTIVO',
        //     codigoUnicoConvocatoria: 0,
        // }
        this.editElementIndex=-1;

       error: (errorResponse: HttpErrorResponse) => {
         this.notificacion(errorResponse);
       };
       },
      })
    );
  }



}
