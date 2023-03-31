import { MdbLabelDirective } from './../../../../code/mdb-angular-ui-kit/forms/label.directive';
import { Semestre } from 'src/app/modelo/semestre';
import { SemestreTbl } from './../../modelo/util/semestre-tbl';
import { Periodo } from './../../modelo/periodo_academico';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import { Subscription } from 'rxjs';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { Notificacion } from '../../util/notificacion';
import { OnDestroy } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef,MdbPopconfirmService,} from 'mdb-angular-ui-kit/popconfirm';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { periodoAcademico } from 'src/app/servicios/periodo-academico.service';
import { MdbDatepickerComponent } from 'mdb-angular-ui-kit/datepicker';

@Component({
  selector: 'app-periodo-academico',
  templateUrl: './periodo-academico.component.html',
  styleUrls: ['./periodo-academico.component.scss'],

})
export class PeriodoAcademicoComponent implements OnInit, OnDestroy {
  periodos: Periodo[];
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  public showLoading: boolean;





   modulos = [
     {value:'ESPECIALIZACIÓN'  ,label:'ESPECIALIZACIÓN' },
     {value:  '7'  ,label: '7' },
   ]

  @ViewChild('table') table!: MdbTableDirective<Periodo>;

  editElementIndex = -1;
  addRow = false;


  headers = [
    'Módulo',
    'Semestre',
    'Fecha de Inicio',
    'Fecha de Fin',
    'Descripcion',
  ];

  translationOptions = {
    title: 'Seleccionar Fecha',
    monthsFull: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    monthsShort: [
     'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'],
    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    okBtnText: 'Ok',
    clearBtnText: 'Listo',
    cancelBtnText: 'Cancelar',
  };


  constructor(
    private notificationService: MdbNotificationService,
    private Api: periodoAcademico,
    public  periodover: Periodo,
    public semestreTbl: SemestreTbl,
    public Valperiodo: Periodo
    ){}



    addNewRow():void {

      const newRow: Periodo = {
        codigo: this.Valperiodo.codigo,
        modulo: this.Valperiodo.modulo,
        semestre: this.Valperiodo.semestre,
        fechainicio: this.Valperiodo.fechainicio,
        fechafin: this.Valperiodo.fechafin,
        descripcion: this.Valperiodo.descripcion,
        estado: this.Valperiodo.estado,
      };

      this.periodos = [...this.periodos, { ...newRow }];
      this.Valperiodo.codigo = '';
      this.Valperiodo.modulo = '';
      this.Valperiodo.semestre = '' as any;
      this.Valperiodo.fechainicio = ''as any;
      this.Valperiodo.fechafin = ''as any;
      this.Valperiodo.descripcion = '' as any;
      this.Valperiodo.estado=''as any;
    }


  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  ngOnInit(): void {

    this.Valperiodo.estado='ACTIVO';
    this.Api.getPeriodo().subscribe(data => {
      this.periodos = data;
    });

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


 public registro(periodo: Periodo): void {
    periodo={...periodo, estado:'ACTIVO'};
   this.showLoading = true;
     this.subscriptions.push(
      this.Api.registroPeriodo(periodo).subscribe({
        next: (response: HttpResponse<Periodo>) => {
          let nuevaAula: Periodo = response.body;
         this.table.data.push(nuevaAula);
         this.notificacionOK('Periodo Académico creada con éxito');
         this.editElementIndex=-1;

        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
           this.showLoading = false;
       },
     })
   );
 }


   public actualizar(periodo: Periodo, Codigo:any): void {
    periodo={...periodo, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarPeriodo(periodo,Codigo).subscribe({
      next: (response: HttpResponse<Periodo>) => {
      let actualizaUnidad: Periodo = response.body;
         this.notificacionOK('Periodo Académico actualizada con éxito');
         this.editElementIndex=-1;

      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
         this.showLoading = false;
      }
       },
     })
     );
   }


    public eliminar(Codigo: any): void {
      this.showLoading = true;
      this.subscriptions.push(
        this.Api.eliminarPeriodo(Codigo).subscribe({
          next: (response: string) => {
            this.notificacionOK('Periodo Académico eliminada con éxito');
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
            console.log(errorResponse);
          },
        })
      );
    }




}
