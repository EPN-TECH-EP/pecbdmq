import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { catchError, of } from 'rxjs';
import { ParametrizaPruebaDetalle } from 'src/app/modelo/flujos/formacion/parametriza-prueba-detalle';
import { ParametrizaPruebaResumen } from 'src/app/modelo/flujos/formacion/parametriza-prueba-resumen';
import { ParametrizaPruebaResumenDatos } from 'src/app/modelo/flujos/formacion/parametriza-prueba-resumen-datos';
import { FormacionService } from 'src/app/servicios/formacion/formacion.service';
import { ParametrizaPruebaService } from 'src/app/servicios/formacion/parametriza-prueba-resumen.service';
import { ComponenteBase } from 'src/app/util/componente-base';
import { FORMACION } from 'src/app/util/constantes/fomacion.const';
import { OPCIONES_DATEPICKER } from 'src/app/util/constantes/opciones-datepicker.const';
import { Notificacion } from 'src/app/util/notificacion';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-subtipo-parametros',
  templateUrl: './subtipo-parametros.component.html',
  styleUrls: ['./subtipo-parametros.component.scss'],
})
export class SubtipoParametrosComponent extends ComponenteBase implements OnInit {
  opcionesDatepicker = OPCIONES_DATEPICKER;

  // datos
  listaParametrizaPruebaResumen: ParametrizaPruebaResumen[] = [];
  listaParametrizaPruebaResumenDatos: ParametrizaPruebaResumenDatos[] = [];
  listaParametrizaPruebaDetalle: ParametrizaPruebaDetalle[] = [];
  parametrizaPruebaDetalleEdit: ParametrizaPruebaDetalle = null;

  // agregar y editar
  editElementIndex: number = -1;
  addRow: boolean = false;
  codigo: number; // codigo de item a modificar o eliminar

  // descompone tiempo en h m s
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;

  // seleccionar
  parametrizaSeleccionado: ParametrizaPruebaResumenDatos = null;

  // estado proceso
  esEstadoPruebas = false;

  // componentes
  @ViewChild('table') table: any;

  // columnas resumen
  headers = [
    { key: 'codSubtipoPrueba', label: 'Subtipo Prueba', width: '150px', wrap: false, start: true },
    { key: 'descripcionPrueba', label: 'Descripción', width: '150px', wrap: false, start: true },
    { key: 'fechaCreacion', label: 'Fecha Creación', width: '100px', wrap: true, start: true },
    { key: 'fechaInicio', label: 'Fecha Inicio', width: '100px', wrap: true, start: true },
    { key: 'fechaFin', label: 'Fecha Fin', width: '100px', wrap: true, start: true },
  ];

  // columnas detalle campos de ParametrizaPruebaDetalle
  headersDetalle = [
    { key: 'sexo', label: 'Sexo', width: '100px', wrap: false, start: true },
    { key: 'edadMeses', label: 'Edad (meses)', width: '100px', wrap: false, start: true },
    { key: 'calificacion', label: 'Calificación', width: '100px', wrap: false, start: true },
    { key: 'numeroRepeticiones', label: 'Repeticiones', width: '100px', wrap: false, start: true },
    { key: 'minutosSegundos', label: 'Minutos:Segundos', width: '100px', wrap: false, start: true },
  ];

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private mdbPopconfirmServiceLocal: MdbPopconfirmService,
    private parametrizaPruebaService: ParametrizaPruebaService,
    private formBuilder: FormBuilder,
    private formacionService: FormacionService
  ) {
    super(notificationServiceLocal, mdbPopconfirmServiceLocal);
  }

  //////////////////////////////////////////
  // Métodos de inicialización
  //////////////////////////////////////////
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

            this.cargarListaPrametrizaPruebaResumen();
          }
        },
      });

    //TODO borrar
    this.esEstadoPruebas = true;
    this.cargarListaPrametrizaPruebaResumen();
    //TODO FIN borrar
  }

  // obtiene lista de parametrizaPruebaResumen desde el servicio
  cargarListaPrametrizaPruebaResumen() {
    this.showLoading = true;

    this.subscriptions.push(
      this.parametrizaPruebaService
        .listarConDatosSubtipoPrueba()
        .pipe(
          catchError((errorResponse: HttpErrorResponse) => {
            console.error(errorResponse);
            this.showLoading = false;
            return of(null);
          })
        )
        .subscribe({
          next: (listaParametrizaPruebaResumenDatos) => {
            this.showLoading = false;

            if (!listaParametrizaPruebaResumenDatos) {
              return;
            }

            this.listaParametrizaPruebaResumenDatos = listaParametrizaPruebaResumenDatos;
          },
        })
    );
  }

  /////////////////////////////////////////////////
  // modificación de valores de parametrización
  /////////////////////////////////////////////////

  undoRow(index) {
    this.editElementIndex = -1;
    this.addRow = false;
    this.codigo = null;
    this.parametrizaPruebaDetalleEdit = null;
  }

  editRow(parametriza: ParametrizaPruebaDetalle, index) {
    this.editElementIndex = index;
    this.addRow = false;
    this.codigo = parametriza.codParametrizaPruebaDetalle;

    // inicializa objeto para editar parametrizaPruebaDetalle. deep copy de parametriza
    this.parametrizaPruebaDetalleEdit = JSON.parse(JSON.stringify(parametriza));

    // extrae los datos de horas, minutos y segundos desde campo minutosSegundos
    this.descomponerHoraMinutosSegundos(parametriza.minutosSegundos);

  }

  //método para actualizar parametrizaPruebaDetalle
  actualizarParametrizaPruebaDetalle(detalle: ParametrizaPruebaDetalle) {
    // valida que los campos sean válidos
    if (
      ValidacionUtil.isNullOrEmptyNumber(this.parametrizaPruebaDetalleEdit.calificacion)) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Ingrese una calificación'
      );   

      return;
    }

    if (
      ValidacionUtil.isNullOrEmptyNumber(this.parametrizaPruebaDetalleEdit.numeroRepeticiones) &&
      (ValidacionUtil.isNullOrEmptyNumber(this.minutos) || ValidacionUtil.isNullOrEmptyNumber(this.segundos))
    ) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Ingrese número de repeticiones o tiempo (minutos y segundos)'
      );

      return;
    }

    // completa los campor requeridos
    this.parametrizaPruebaDetalleEdit.codParametrizaPruebaDetalle = detalle.codParametrizaPruebaDetalle;
    this.parametrizaPruebaDetalleEdit.sexo = detalle.sexo;
    this.parametrizaPruebaDetalleEdit.codParametrizaPruebaResumen = detalle.codParametrizaPruebaResumen;
    this.parametrizaPruebaDetalleEdit.edadInicioMeses = detalle.edadInicioMeses;
    this.parametrizaPruebaDetalleEdit.edadFinMeses = detalle.edadFinMeses;
    this.parametrizaPruebaDetalleEdit.estado = detalle.estado;

    // completa minutos y segundos
    this.parametrizaPruebaDetalleEdit.minutosSegundos = this.estructurarHoraMinutosSegundos(
      this.horas,
      this.minutos,
      this.segundos
    );

    this.subscriptions.push(
      this.parametrizaPruebaService.actualizar(this.parametrizaPruebaDetalleEdit, this.codigo).subscribe({
        next: (response: HttpResponse<ParametrizaPruebaDetalle>) => {
          const parametrizaActualizado: ParametrizaPruebaDetalle = response.body;

          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Parámetros actualizados con éxito'
          );

          this.listaParametrizaPruebaDetalle[this.editElementIndex] = parametrizaActualizado;
          this.listaParametrizaPruebaDetalle = [...this.listaParametrizaPruebaDetalle];
          //this.pruebaDetalleForm.reset();

          this.editElementIndex = -1;
          this.parametrizaPruebaDetalleEdit = null;
        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  /////////////////////////////////////////////////
  // selección
  /////////////////////////////////////////////////
  onSelectRow(parametriza) {
    this.parametrizaSeleccionado = parametriza;

    console.log('parametriza seleccionado', this.parametrizaSeleccionado);

    // obtiene detalle desde servicio listarPorResumen
    this.subscriptions.push(
      this.parametrizaPruebaService
        .listarPorResumen(this.parametrizaSeleccionado.codParametrizaPruebaResumen)
        .pipe(
          catchError((errorResponse: HttpErrorResponse) => {
            console.error(errorResponse);
            return of(null);
          })
        )
        .subscribe({
          next: (listaParametrizaPruebaDetalle) => {
            if (!listaParametrizaPruebaDetalle) {
              return;
            }

            this.listaParametrizaPruebaDetalle = listaParametrizaPruebaDetalle;
          },
        })
    );
  }

  /////////////////////////////////////////////////
  // utilitarios

  // descompone cadena HH:MM:SS en horas, minutos y segundos
  descomponerHoraMinutosSegundos(horaMinutosSegundos: string) {
    const horaMinutosSegundosArray = horaMinutosSegundos.split(':');
    this.horas = Number.parseInt(horaMinutosSegundosArray[0]);
    this.minutos = Number.parseInt(horaMinutosSegundosArray[1]);
    this.segundos = Number.parseInt(horaMinutosSegundosArray[2]);
  }

  // estructura cadena HH:MM:SS a partir de horas, minutos y segundos. cada número debe tener dos dígitos
  estructurarHoraMinutosSegundos(horas: number, minutos: number, segundos: number) {
    return `${this.completarCeros(horas)}:${this.completarCeros(minutos)}:${this.completarCeros(segundos)}`;
  }

  // completa con ceros a la izquierda hasta que el número tenga dos dígitos
  completarCeros(numero: number) {
    return numero.toString().padStart(2, '0');
  }
}
