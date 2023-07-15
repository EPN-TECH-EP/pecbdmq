import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { catchError, of } from 'rxjs';
import { SubtipoPrueba } from 'src/app/modelo/admin/subtipo-prueba';
import { PruebaDetalle } from 'src/app/modelo/flujos/formacion/prueba-detalle';
import { PruebaDetalleDatos } from 'src/app/modelo/flujos/formacion/prueba-detalle-datos';
import { FormacionService } from 'src/app/servicios/formacion/formacion.service';
import { PruebaDetalleService } from 'src/app/servicios/formacion/prueba-detalle.service';
import { SubtipoPruebaService } from 'src/app/servicios/subtipo-prueba.service';
import { ComponenteBase } from 'src/app/util/componente-base';
import { FORMACION } from 'src/app/util/constantes/fomacion.const';
import { Notificacion } from 'src/app/util/notificacion';

@Component({
  selector: 'app-resultados-pruebas',
  templateUrl: './resultados-pruebas.component.html',
  styleUrls: ['./resultados-pruebas.component.scss']
})
export class ResultadosPruebasComponent extends ComponenteBase implements OnInit {

  // datos
  listaPruebaDetalleDatos: PruebaDetalleDatos[];
  pruebaDetalleSeleccionada: PruebaDetalleDatos;


  // estado proceso
  esEstadoPruebas = false;

  // componentes
  @ViewChild('table') table: any;

   // eventos
   addRow = false;
   estaEditando = false;
   editIndex: number;
   codigo: number;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private mdbPopconfirmServiceLocal: MdbPopconfirmService,
    private formacionService: FormacionService,    
    private pruebaDetalleService: PruebaDetalleService,
  ) {
    super(notificationServiceLocal, mdbPopconfirmServiceLocal);
   }

  ngOnInit(): void {
    this.formacionService
    .getEstadoActual()
    .pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        console.error(errorResponse);
        return of(null);
      })
    )
    .subscribe({
      next: (estado) => {
        if (!estado || estado.httpStatusCode !== 200) {
          return;
        }

        if (estado.mensaje === FORMACION.estadoPruebas) {
          this.esEstadoPruebas = true;

          this.cargaListaPruebas();
          
        }
      },
    });

  //TODO borrar
  this.esEstadoPruebas = true;

  this.cargaListaPruebas();
  //TODO FIN borrar  
  }  

  cargaListaPruebas() {
    this.subscriptions.push(
      this.pruebaDetalleService.listarConDatosTipoPrueba().subscribe({
        next: (lista: PruebaDetalleDatos[]) => {
          this.listaPruebaDetalleDatos = lista;
          
          // establecer la prueba seleccionada a la primera activa
          for (let index = 0; index < this.listaPruebaDetalleDatos.length; index++) {            
            if (this.listaPruebaDetalleDatos[index].estado !== FORMACION.estadoPruebasCierre) {
              this.pruebaDetalleSeleccionada = this.listaPruebaDetalleDatos[index];  
              break;
            }             
          }


        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
    }


    // selección de prueba para el registro de resultados
    onPruebaSeleccionada($event) {

      this.pruebaDetalleSeleccionada = $event;
    }

    

}
