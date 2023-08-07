import { Component, OnInit, ViewChild } from '@angular/core';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { SubtipoPruebaDatos } from 'src/app/modelo/admin/subtipo-prueba-datos';
import { PruebaDetalle } from 'src/app/modelo/flujos/formacion/prueba-detalle';
import { SubtipoPruebaService } from 'src/app/servicios/subtipo-prueba.service';
import { ComponenteBase } from 'src/app/util/componente-base';
import { Notificacion } from 'src/app/util/notificacion';
import { PruebaDetalleService } from '../../../../servicios/formacion/prueba-detalle.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyValidators } from 'src/app/util/validators';
import { FormacionService } from 'src/app/servicios/formacion/formacion.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { FORMACION } from 'src/app/util/constantes/fomacion.const';
import { PruebaDetalleDatos } from 'src/app/modelo/flujos/formacion/prueba-detalle-datos';
import { OPCIONES_DATEPICKER } from 'src/app/util/constantes/opciones-datepicker.const';
import { PruebaDetalleOrden } from 'src/app/modelo/flujos/formacion/prueba-detalle-orden';
import {Curso} from "../../../../modelo/flujos/especializacion/Curso";
import {CursosService} from "../../../../servicios/especializacion/cursos.service";
import {ESPECIALIZACION} from "../../../../util/constantes/especializacion.const";

@Component({
  selector: 'app-lista-pruebas-curso',
  templateUrl: './lista-pruebas-curso.component.html',
  styleUrls: ['./lista-pruebas-curso.component.scss']
})
export class ListaPruebasCursoComponent extends ComponenteBase implements OnInit {

  // selección de curso
  cursos: Curso[];
  cursoSeleccionado: Curso;

  esVistaCurso: boolean;
  esVistaListaCursos: boolean;

  opcionesDatepicker = OPCIONES_DATEPICKER;

  // datos
  listaSubtipoPrueba: SubtipoPruebaDatos[];
  listaPruebaDetalle: PruebaDetalle[];
  listaPruebaDetalleDatos: PruebaDetalleDatos[];
  pruebaDetalleEdit: PruebaDetalle;

  // agregar y editar
  editElementIndex: number = -1;
  addRow: boolean = false;
  codigo: number; // codigo de item a modificar o eliminar

  // reordenar
  reordenar: boolean = false;
  listaOrden: PruebaDetalleOrden[] = [];
  listaOrdenInicial: PruebaDetalleOrden[] = [];
  listaPruebaDetalleDatosInicial: PruebaDetalleDatos[] = [];

  // columnas
  headers = [
    { key: 'ordenTipoPrueba', label: 'Orden', width: '50px', wrap: true, start: false },
    { key: 'codSubtipoPrueba', label: 'Subtipo Prueba', width: '150px', wrap: false, start: true },
    { key: 'descripcionPrueba', label: 'Descripción', width: '150px', wrap: false, start: true },
    { key: 'fecha', label: 'Fechas', width: '100px', wrap: true, start: true },
    /*{ key: 'fechaInicio', label: 'Fecha Inicio', width: '100px', wrap: true },
    { key: 'fechaFin', label: 'Fecha Fin', width: '100px', wrap: true },
    { key: 'hora', label: 'Hora', width: '50px', wrap: true },*/

    { key: 'puntaje', label: 'Puntajes', width: '50px', wrap: true, start: true },
    /*{ key: 'puntajeMinimo', label: 'Puntaje Mínimo', width: '50px', wrap: true },
    { key: 'puntajeMaximo', label: 'Puntaje Máximo', width: '50px', wrap: true },
    { key: 'tienePuntaje', label: 'Tiene Puntaje', width: '50px', wrap: true },*/
  ];

  // estado proceso
  esEstadoPruebas = false;

  // componentes
  @ViewChild('table') table: any;
  pruebaDetalleForm: FormGroup;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private mdbPopconfirmServiceLocal: MdbPopconfirmService,
    private subtipoPruebaService: SubtipoPruebaService,
    private pruebaDetalleService: PruebaDetalleService,
    private formBuilder: FormBuilder,
    private formacionService: FormacionService,
    private cursosService: CursosService,
  ) {
    super(notificationServiceLocal, mdbPopconfirmServiceLocal);

    this.cursos = [];
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;

    this.construirFormulario();
  }

  // campos de pruebaDetalleForm
  get descripcionPruebaField() {
    return this.pruebaDetalleForm.get('descripcionPrueba');
  }
  get fechaInicioField() {
    return this.pruebaDetalleForm.get('fechaInicio');
  }
  get fechaFinField() {
    return this.pruebaDetalleForm.get('fechaFin');
  }
  get horaField() {
    return this.pruebaDetalleForm.get('hora');
  }
  get codSubtipoPruebaField() {
    return this.pruebaDetalleForm.get('codSubtipoPrueba');
  }
  get ordenTipoPruebaField() {
    return this.pruebaDetalleForm.get('ordenTipoPrueba');
  }
  get puntajeMinimoField() {
    return this.pruebaDetalleForm.get('puntajeMinimo');
  }
  get puntajeMaximoField() {
    return this.pruebaDetalleForm.get('puntajeMaximo');
  }
  get tienePuntajeField() {
    return this.pruebaDetalleForm.get('tienePuntaje');
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

            this.cargarListaSubtipoPrueba();
          }
        },
      });

    //TODO borrar
    //this.esEstadoPruebas = true;
    //this.cargarListaSubtipoPrueba();
    //TODO FIN borrar
  }

  // obtiene la lista de subtipos de prueba registrados
  cargarListaSubtipoPrueba() {
    this.subscriptions.push(
      this.subtipoPruebaService.listarConDatosTipoPrueba().subscribe({
        next: (listaSubtipoPrueba: SubtipoPruebaDatos[]) => {
          this.listaSubtipoPrueba = listaSubtipoPrueba;

          console.log('listaSubtipoPrueba', listaSubtipoPrueba);

          this.cargarListaPruebaDetalle();
        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  // obtiene la lista de prueba detalle desde el servicio
  cargarListaPruebaDetalle() {
    this.subscriptions.push(
      this.pruebaDetalleService.listarConDatosTipoPrueba().subscribe({
        next: (lista: PruebaDetalleDatos[]) => {
          this.listaPruebaDetalleDatos = lista;
          console.log('listaPruebaDetalle', lista);
        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  // lista de cursos con estado VALIDACIÓN. usar cursosService.listarCursosPorEstado
  cargarListaCursos() {
    this.subscriptions.push(
      this.cursosService.listarCursosPorEstado("VALIDACIÓN").subscribe({
        next: (lista: Curso[]) => {
          this.cursos = lista;
          console.log('listaCursos', lista);
        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  //////////////////////////////////////////
  // Métodos de CRUD
  //////////////////////////////////////////
  private construirFormulario() {
    this.pruebaDetalleForm = this.formBuilder.group(
      {
        descripcionPrueba: ['', Validators.required],
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
        hora: ['', Validators.required],
        codSubtipoPrueba: ['', Validators.required],
        ordenTipoPrueba: [''],
        puntajeMinimo: [''],
        puntajeMaximo: [''],
        tienePuntaje: [''],
      },
      {
        validators: MyValidators.validDate,
      }
    );
  }

  private matchDatosPruebaDetalleFormulario(pruebaDetalle: PruebaDetalle) {
    const fechaInicioOriginal = new Date(pruebaDetalle.fechaInicio);
    const fechaFinOriginal = new Date(pruebaDetalle.fechaFin);
    fechaInicioOriginal.setMinutes(fechaInicioOriginal.getMinutes() + fechaInicioOriginal.getTimezoneOffset());
    fechaFinOriginal.setMinutes(fechaFinOriginal.getMinutes() + fechaFinOriginal.getTimezoneOffset());

    pruebaDetalle.fechaInicio = fechaInicioOriginal;
    pruebaDetalle.fechaFin = fechaFinOriginal;

    this.pruebaDetalleForm.patchValue({
      descripcionPrueba: pruebaDetalle?.descripcionPrueba,
      fechaInicio: pruebaDetalle?.fechaInicio,
      fechaFin: pruebaDetalle?.fechaFin,
      hora: pruebaDetalle?.hora,
      codSubtipoPrueba: pruebaDetalle?.codSubtipoPrueba,
      ordenTipoPrueba: pruebaDetalle?.ordenTipoPrueba,
      puntajeMinimo: pruebaDetalle?.puntajeMinimo,
      puntajeMaximo: pruebaDetalle?.puntajeMaximo,
      tienePuntaje: pruebaDetalle?.tienePuntaje,
    });
  }

  public guardar() {
    // validar que la fechaInicio no sea mayor a la fechaFin

    const fechaInicio = this.pruebaDetalleForm.get('fechaInicio').value;
    const fechaFin = this.pruebaDetalleForm.get('fechaFin').value;

    if (fechaInicio > fechaFin) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'La fecha de inicio no puede ser mayor a la fecha de fin'
      );
      return;
    }

    if (this.pruebaDetalleForm.invalid) {
      return;
    }

    const pruebaDetalleFormulario = this.pruebaDetalleForm.value;

    // completa información de la prueba detalle
    let subtipoPrueba: SubtipoPruebaDatos;
    subtipoPrueba = this.buscaSubtipoPruebaPorCodigo(subtipoPrueba, pruebaDetalleFormulario);

    // se usa un solo método para gestionar creación y actualización
    // si se activa la bandera addRow, entonces es nuevo registro
    if (this.addRow) {
      // conforma el nuevo objeto con los datos complementarios

      // obtener el valor máximo de orden para asignar el siguiente
      let ordenMaximo = this.listaPruebaDetalleDatos.reduce(
        (max, pruebaDetalle) => (pruebaDetalle.ordenTipoPrueba > max ? pruebaDetalle.ordenTipoPrueba : max),
        this.listaPruebaDetalleDatos[0]?.ordenTipoPrueba
      );

      if (ordenMaximo === undefined || ordenMaximo === null)
      {
        ordenMaximo = 0;
      }

      const pruebaDetalleNew: PruebaDetalle = {
        codPruebaDetalle: pruebaDetalleFormulario.codPruebaDetalle,
        descripcionPrueba: pruebaDetalleFormulario.descripcionPrueba,
        fechaInicio: pruebaDetalleFormulario.fechaInicio,
        fechaFin: pruebaDetalleFormulario.fechaFin,
        hora: pruebaDetalleFormulario.hora,
        estado: 'ACTIVO',
        codPeriodoAcademico: pruebaDetalleFormulario.codPeriodoAcademico,
        codCursoEspecializacion: pruebaDetalleFormulario.codCursoEspecializacion,
        codSubtipoPrueba: pruebaDetalleFormulario.codSubtipoPrueba,
        ordenTipoPrueba: ordenMaximo + 1,
        puntajeMinimo: pruebaDetalleFormulario.puntajeMinimo,
        puntajeMaximo: pruebaDetalleFormulario.puntajeMaximo,
        tienePuntaje: pruebaDetalleFormulario.tienePuntaje,
      };

      this.subscriptions.push(
        this.pruebaDetalleService.crear(pruebaDetalleNew).subscribe({
          next: (response: HttpResponse<PruebaDetalle>) => {
            const pruebaDetalle = response.body;

            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Prueba de formación creada con éxito'
            );

            const pruebaDetalleDatosNew: PruebaDetalleDatos = {
              codPruebaDetalle: pruebaDetalle.codPruebaDetalle,
              descripcionPrueba: pruebaDetalle.descripcionPrueba,
              fechaInicio: pruebaDetalle.fechaInicio,
              fechaFin: pruebaDetalle.fechaFin,
              hora: pruebaDetalle.hora,
              estado: pruebaDetalle.estado,
              codPeriodoAcademico: pruebaDetalle.codPeriodoAcademico,
              codCursoEspecializacion: pruebaDetalle.codCursoEspecializacion,
              codSubtipoPrueba: pruebaDetalle.codSubtipoPrueba,
              ordenTipoPrueba: pruebaDetalle.ordenTipoPrueba,
              puntajeMinimo: pruebaDetalle.puntajeMinimo,
              puntajeMaximo: pruebaDetalle.puntajeMaximo,
              tienePuntaje: pruebaDetalle.tienePuntaje,
              tipoPruebaNombre: subtipoPrueba.nombre,
              subTipoPruebaNombre: subtipoPrueba.tipoPrueba,
              esFisica: subtipoPrueba.esFisica,
            };

            this.listaPruebaDetalleDatos.push(pruebaDetalleDatosNew);
            this.listaPruebaDetalleDatos = [...this.listaPruebaDetalleDatos];
            this.addRow = false;
            this.pruebaDetalleForm.reset();
          },
          error: (errorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          },
        })
      );
    }
    // actualizar
    else {
      // obtener el objeto de la lista
      const pruebaDetalleDatos = this.listaPruebaDetalleDatos[this.editElementIndex];

      this.codigo = pruebaDetalleDatos.codPruebaDetalle;

      const pruebaDetalleEdit: PruebaDetalle = {
        codPruebaDetalle: pruebaDetalleDatos.codPruebaDetalle,
        descripcionPrueba: pruebaDetalleFormulario.descripcionPrueba,
        fechaInicio: pruebaDetalleFormulario.fechaInicio,
        fechaFin: pruebaDetalleFormulario.fechaFin,
        hora: pruebaDetalleFormulario.hora,
        estado: pruebaDetalleDatos.estado,
        codPeriodoAcademico: pruebaDetalleDatos.codPeriodoAcademico,
        codCursoEspecializacion: pruebaDetalleDatos.codCursoEspecializacion,
        codSubtipoPrueba: pruebaDetalleFormulario.codSubtipoPrueba,
        ordenTipoPrueba: pruebaDetalleDatos.ordenTipoPrueba,
        puntajeMinimo: pruebaDetalleFormulario.puntajeMinimo?pruebaDetalleFormulario.puntajeMinimo:0,
        puntajeMaximo: pruebaDetalleFormulario.puntajeMaximo?pruebaDetalleFormulario.puntajeMaximo:0,
        tienePuntaje: pruebaDetalleFormulario.tienePuntaje,
      };

      this.subscriptions.push(
        this.pruebaDetalleService.actualizar(pruebaDetalleEdit, this.codigo).subscribe({
          next: (response: HttpResponse<PruebaDetalle>) => {
            const pruebaDetalle: PruebaDetalle = response.body;

            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Prueba de formación actualizada con éxito'
            );
            const pruebaDetalleDatosEdit = this.listaPruebaDetalleDatos[this.editElementIndex];

            // completa información de la prueba detalle
            pruebaDetalleDatosEdit.descripcionPrueba = pruebaDetalle.descripcionPrueba;
            pruebaDetalleDatosEdit.fechaInicio = pruebaDetalle.fechaInicio;
            pruebaDetalleDatosEdit.fechaFin = pruebaDetalle.fechaFin;
            pruebaDetalleDatosEdit.hora = pruebaDetalle.hora;
            pruebaDetalleDatosEdit.estado = pruebaDetalle.estado;
            pruebaDetalleDatosEdit.codPeriodoAcademico = pruebaDetalle.codPeriodoAcademico;
            pruebaDetalleDatosEdit.codCursoEspecializacion = pruebaDetalle.codCursoEspecializacion;
            pruebaDetalleDatosEdit.codSubtipoPrueba = pruebaDetalle.codSubtipoPrueba;
            pruebaDetalleDatosEdit.puntajeMinimo = pruebaDetalle.puntajeMinimo;
            pruebaDetalleDatosEdit.puntajeMaximo = pruebaDetalle.puntajeMaximo;
            pruebaDetalleDatosEdit.tienePuntaje = pruebaDetalle.tienePuntaje;

            let subtipoPrueba: SubtipoPruebaDatos;
            subtipoPrueba = this.buscaSubtipoPruebaPorCodigo(subtipoPrueba, pruebaDetalle);

            pruebaDetalleDatosEdit.tipoPruebaNombre = subtipoPrueba.nombre;
            pruebaDetalleDatosEdit.subTipoPruebaNombre = subtipoPrueba.tipoPrueba;

            this.listaPruebaDetalleDatos[this.editElementIndex] = pruebaDetalleDatosEdit;
            this.listaPruebaDetalleDatos = [...this.listaPruebaDetalleDatos];
            this.pruebaDetalleForm.reset();

            this.editElementIndex = -1;
          },
          error: (errorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          },
        })
      );
    }
  }

  private buscaSubtipoPruebaPorCodigo(subtipoPrueba: SubtipoPruebaDatos, pruebaDetalle: PruebaDetalle) {
    subtipoPrueba = this.listaSubtipoPrueba.find(
      (subtipoPrueba) => subtipoPrueba.codSubtipoPrueba === pruebaDetalle.codSubtipoPrueba
    );
    return subtipoPrueba;
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
      this.pruebaDetalleService.eliminar(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Prueba de formación eliminada con éxito'
          );
          this.showLoading = false;
          const index = this.listaPruebaDetalleDatos.findIndex(
            (ponderacion) => ponderacion.codPruebaDetalle === this.codigo
          );
          this.listaPruebaDetalleDatos.splice(index, 1);
          this.listaPruebaDetalleDatos = [...this.listaPruebaDetalleDatos];

          this.corrigeOrdenLuegoDeEliminar();
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          console.log(errorResponse);
        },
      })
    );
  }

  editRow(pruebaDetalle: PruebaDetalle, index: number) {
    this.editElementIndex = index;
    this.matchDatosPruebaDetalleFormulario(pruebaDetalle);
  }

  undoRow() {
    this.editElementIndex = -1;
    this.addRow = false;

    this.resetForm();
  }

  private resetForm() {
    this.pruebaDetalleForm.reset();
    this.pruebaDetalleForm.markAsUntouched();
    this.pruebaDetalleForm.markAsPristine();
    this.pruebaDetalleForm.updateValueAndValidity();
  }

  onAgregar() {
    /*this.pruebaDetalleForm.reset();
    this.pruebaDetalleForm.markAsUntouched();
    this.pruebaDetalleForm.markAsPristine();
    this.pruebaDetalleForm.updateValueAndValidity();*/
    this.addRow = true;
  }

  onTienePuntajeChange($event) {
    if ($event.target.checked) {
      this.pruebaDetalleForm.get('puntajeMinimo').enable();
      this.pruebaDetalleForm.get('puntajeMaximo').enable();
    } else {
      this.pruebaDetalleForm.get('puntajeMinimo').disable();
      this.pruebaDetalleForm.get('puntajeMaximo').disable();
    }
  }

  moverAntes(pruebaDetalle, index) {
    this.guardarOrdenInicial();

    if (index === 0) {
      return;
    }

    const pruebaDetalleAnterior = this.listaPruebaDetalleDatos[index - 1];

    this.listaPruebaDetalleDatos[index - 1] = pruebaDetalle;
    this.listaPruebaDetalleDatos[index] = pruebaDetalleAnterior;

    this.listaPruebaDetalleDatos[index - 1].ordenTipoPrueba = index;
    this.listaPruebaDetalleDatos[index].ordenTipoPrueba = index + 1;

    this.guardarOrdenNuevo();
  }

  moverDespues(pruebaDetalle, index) {
    this.guardarOrdenInicial();

    if (index === this.listaPruebaDetalleDatos.length - 1) {
      return;
    }

    const pruebaDetalleSiguiente = this.listaPruebaDetalleDatos[index + 1];

    this.listaPruebaDetalleDatos[index + 1] = pruebaDetalle;
    this.listaPruebaDetalleDatos[index] = pruebaDetalleSiguiente;

    this.listaPruebaDetalleDatos[index + 1].ordenTipoPrueba = index + 2;
    this.listaPruebaDetalleDatos[index].ordenTipoPrueba = index + 1;

    this.guardarOrdenNuevo();
  }

  guardarOrdenInicial() {
    if (this.listaPruebaDetalleDatosInicial.length === 0) {
      this.listaPruebaDetalleDatosInicial = [...this.listaPruebaDetalleDatos];
    }

    if (this.listaOrdenInicial.length === 0) {
      this.listaPruebaDetalleDatos.forEach((pruebaDetalle) => {
        this.listaOrdenInicial.push({
          codPruebaDetalle: pruebaDetalle.codPruebaDetalle,
          ordenTipoPrueba: pruebaDetalle.ordenTipoPrueba,
        });
      });
    }
  }

  guardarOrdenNuevo() {
    this.reordenar = true;
    this.listaOrden = [];

    this.listaPruebaDetalleDatos.forEach((pruebaDetalle) => {
      this.listaOrden.push({
        codPruebaDetalle: pruebaDetalle.codPruebaDetalle,
        ordenTipoPrueba: pruebaDetalle.ordenTipoPrueba,
      });
    });
  }

  guardarOrdenServicio(elimina: boolean) {

    if (!elimina) {
      this.guardarOrdenNuevo();
    }

    this.subscriptions.push(
      this.pruebaDetalleService.reordenar(this.listaOrden).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Orden de pruebas de formación guardado con éxito'
          );

          this.listaOrdenInicial = [];
          this.guardarOrdenInicial();

          this.reordenar = false;

          if (elimina) {
            this.cargarListaPruebaDetalle();
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          console.log(errorResponse);
        },
      })
    );
  }

  restablecerOrden() {
    this.cargarListaPruebaDetalle();

    this.listaPruebaDetalleDatos = [...this.listaPruebaDetalleDatos];

    this.listaOrden = [];
    this.listaOrdenInicial = [];
    this.reordenar = false;
  }

  corrigeOrdenLuegoDeEliminar() {
    this.listaOrden = [];

    this.listaPruebaDetalleDatos.forEach((pruebaDetalle, index) => {
      if (pruebaDetalle.ordenTipoPrueba !== index + 1) {
        this.listaOrden.push({
          codPruebaDetalle: pruebaDetalle.codPruebaDetalle,
          ordenTipoPrueba: index + 1,
        });
      }
    });

    if (this.listaOrden.length > 0) {
      this.guardarOrdenServicio(true);
    }
  }

  ////////////////////////////////////////////
  ///////// Lista y Selección de curso  //////
  ////////////////////////////////////////////
  cursoSeleccionadoEvent($event: Curso) {
    if ($event !== null) {
      this.cursoSeleccionado = $event;
      this.esVistaCurso = true;
      this.esVistaListaCursos = false;
      console.log($event);
    }
  }
}
