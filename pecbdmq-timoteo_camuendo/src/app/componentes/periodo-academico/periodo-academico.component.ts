// import { ModuloEstadosService } from './../../servicios/modulo-estados.service';
// import { ModuloEstados } from './../../modelo/modulo-estados';
// import { SemestreService } from './../../servicios/semestre.service';
// import { ModuloService } from 'src/app/servicios/modulo.service';
// import { MdbLabelDirective } from './../../../../code/mdb-angular-ui-kit/forms/label.directive';
// import { Semestre } from 'src/app/modelo/semestre';
// import { SemestreTbl } from './../../modelo/util/semestre-tbl';
// import { Periodo } from './../../modelo/periodo_academico';
// import { Component, OnInit } from '@angular/core';
// import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
// import { MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
// import { Subscription } from 'rxjs';
// import { TipoAlerta } from 'src/app/enum/tipo-alerta';
// import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
// import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
// import { Notificacion } from '../../util/notificacion';
// import { OnDestroy } from '@angular/core';
// import { ViewChild } from '@angular/core';
// import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
// import { MdbPopconfirmRef,MdbPopconfirmService,} from 'mdb-angular-ui-kit/popconfirm';
// import { AlertaComponent } from '../util/alerta/alerta.component';
// import { periodoAcademicoService } from 'src/app/servicios/periodo-academico.service';
// import { MdbDatepickerComponent } from 'mdb-angular-ui-kit/datepicker';
// import { FormControl } from '@angular/forms';

// @Component({
//   selector: 'app-periodo-academico',
//   templateUrl: './periodo-academico.component.html',
//   styleUrls: ['./periodo-academico.component.scss'],

// })
// export class PeriodoAcademicoComponent implements OnInit, OnDestroy {
//   periodos: Periodo[];
//   selectedPeriodo: any = null; // variable para almacenar el registro seleccionado
//   selectedModuloEstados: any = null; // variable para almacenar el registro seleccionado
//   modulosEstados: ModuloEstados[];
//   periodo: Periodo;
//   periodoEditForm: Periodo;

//   private subscriptions: Subscription[] = [];
//   notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
//   public showLoading: boolean;

//   @ViewChild('table') table!: MdbTableDirective<Periodo>;

//   editElementIndex = -1;
//   addRow = false;
//   datepicker1= '' as any;
//   datepicker2= '' as any;
//   datepicker3= '' as any;
//   datepicker4= '' as any;

//   headers = [
//     'Módulo',
//     'Módulo de Estados',
//     'Fecha de Inicio',
//     'Fecha de Fin',
//     'Descripcion',
//   ];


//   translationOptions = {
//     title: 'Seleccionar Fecha',
//     monthsFull: [
//       'Enero',
//       'Febrero',
//       'Marzo',
//       'Abril',
//       'Mayo',
//       'Junio',
//       'Julio',
//       'Agosto',
//       'Septiembre',
//       'Octubre',
//       'Noviembre',
//       'Diciembre',
//     ],
//     monthsShort: [
//       'Ene',
//       'Feb',
//       'Mar',
//       'Abr',
//       'May',
//       'Jun',
//       'Jul',
//       'Ago',
//       'Sep',
//       'Oct',
//       'Nov',
//       'Dic',
//     ],

//     weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
//     weekdaysNarrow: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
//     okBtnText: 'Ok',
//     clearBtnText: 'Listo',
//     cancelBtnText: 'Cancelar',
//   };


//   constructor(
//     private notificationService: MdbNotificationService,
//     private Api: periodoAcademicoService,
//     private ApiModuloEstados: ModuloEstadosService,
//     public  periodover: Periodo,
//     ){
//       this.periodos =[];
//       this.subscriptions=[];
//       this.periodo ={
//         codigo: 0,
//         moduloEstados: 0,
//         fechaInicio:''as any,
//         fechaFin:''as any,
//         descripcion:'',
//         estado:'ACTIVO'
//       }
//       this.periodoEditForm ={
//           codigo: 0,
//           moduloEstados: 0,
//           fechaInicio:''as any,
//           fechaFin:''as any,
//           descripcion:'',
//           estado:'ACTIVO'
//       }
//     }

//   search(event: Event): void {
//     const searchTerm = (event.target as HTMLInputElement).value;
//     this.table.search(searchTerm);
//   }

//   ngOnInit(): void {
//     this.Api.getPeriodo().subscribe(data => {
//       this.periodos = data;
//     });

//     this.ApiModuloEstados.getModuloEstados().subscribe(data => {
//       this.modulosEstados = data;
//     });

//   }


//   ngOnDestroy(): void {
//     this.subscriptions.forEach((sub) => sub.unsubscribe());
//   }


//   private notificacion(errorResponse: HttpErrorResponse) {
//     let customError: CustomHttpResponse = errorResponse.error;
//     let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;

//     let mensajeError = customError.mensaje;
//     let codigoError = errorResponse.status;

//     if (!mensajeError) {
//       mensajeError = 'Error inesperado';
//       tipoAlerta = TipoAlerta.ALERTA_ERROR;
//     }

//     if (codigoError === 0) {
//      mensajeError = 'Error de conexión al servidor';
//      tipoAlerta = TipoAlerta.ALERTA_ERROR;
//    }
//     this.notificationRef = Notificacion.notificar(
//       this.notificationService,
//       mensajeError,
//       tipoAlerta
//     )
//   }

//   public notificacionOK(mensaje:string){
//     this.notificationRef = Notificacion.notificar(
//     this.notificationService,
//     mensaje,
//     TipoAlerta.ALERTA_OK
//     );
//   }


//  public registro(periodo: Periodo): void {
//     periodo={...periodo, estado:'ACTIVO'};
//    this.showLoading = true;
//      this.subscriptions.push(
//       this.Api.registroPeriodo(periodo).subscribe({
//         next: (response: HttpResponse<Periodo>) => {
//           let nuevoPeriodo: Periodo = response.body;
//          this.table.data.push(nuevoPeriodo);
//          this.notificacionOK('Periodo Académico creada con éxito');
//          this.Api.getPeriodo().subscribe(data => {
//           this.periodos = data;
//         });
//        this.ApiModuloEstados.getModuloEstados().subscribe(data => {
//           this.modulosEstados = data;
//         });

//          this.periodo ={
//           codigo: 0,
//           moduloEstados:0,
//           fechaInicio:''as any,
//           fechaFin:''as any,
//           descripcion:'',
//           estado:'ACTIVO'
//         }

//         },
//         error: (errorResponse: HttpErrorResponse) => {
//           this.notificacion(errorResponse);
//            this.showLoading = false;
//        },
//      })
//    );
//  }


//  editRow(index: number) {
//   this.editElementIndex = index;
//   this.periodoEditForm = {...this.periodos[index]};
//   this.periodoEditForm = {
//     codigo: 0,
//     moduloEstados:0,
//     fechaInicio:''as any,
//     fechaFin:''as any,
//     descripcion:'',
//     estado:'ACTIVO'
// };
// }

// undoRow() {
//   this.periodoEditForm = {
//       codigo: 0,
//       moduloEstados:0,
//       fechaInicio:''as any,
//       fechaFin:''as any,
//       descripcion:'',
//       estado:'ACTIVO'
//   };
//   this.editElementIndex = -1;
// }



//    public actualizar(periodo: Periodo, formValue): void {
//     periodo={...periodo,
//       moduloEstados: formValue.moduloEstados,
//       fechaInicio: formValue.fechaInicio,
//       fechaFin: formValue.fechaFin,
//       descripcion: formValue.descripcion,
//       estado: 'ACTIVO'
// };
//     this.showLoading = true;
//     this.subscriptions.push(
//       this.Api.actualizarPeriodo(periodo,periodo.codigo).subscribe({
//       next: (response) => {
//         this.notificacionOK('Periodo Académico actualizada con éxito');
//         this.periodos[this.editElementIndex] = response.body;
//         this.showLoading = false;
//         this.Api.getPeriodo().subscribe(data => {
//           this.periodos = data;
//         });



//         this.ApiModuloEstados.getModuloEstados().subscribe(data => {
//           this.modulosEstados = data;
//         });
//         this.periodo ={
//           codigo: 0,
//           moduloEstados:0,
//           fechaInicio:''as any,
//           fechaFin:''as any,
//           descripcion:'',
//           estado:'ACTIVO'
//         }
//         this.editElementIndex = -1;
//       },
//       error: (errorResponse: HttpErrorResponse) => {
//         this.notificacion(errorResponse);
//       },
//   })
// )
// }

// //eliminar
//     public eliminar(codigo: number): void {
//       this.showLoading = true;
//       this.subscriptions.push(
//         this.Api.eliminarPeriodo(codigo).subscribe({
//           next: (response: string) => {
//             this.notificacionOK('Periodo Académico eliminada con éxito');
//             this.showLoading = false;
//             const index = this.periodos.findIndex(periodo => periodo.codigo === codigo);
//             this.periodos.splice(index, 1);
//             this.periodos = [...this.periodos]
//             this.showLoading = false;
//           },
//           error: (errorResponse: HttpErrorResponse) => {
//             this.notificacion(errorResponse);
//           },
//         })
//       );
//     }


//     showRecord(): void {
//       this.ApiModuloEstados.getModuloEstados().subscribe(data => {
//         this.selectedModuloEstados = data;
//       });
//     }
// }
