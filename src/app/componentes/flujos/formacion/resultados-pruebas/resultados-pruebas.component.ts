import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { catchError, of, first, tap, throwError } from 'rxjs';
import { SubtipoPrueba } from 'src/app/modelo/admin/subtipo-prueba';
import { PaginacionPostulantesValidos } from 'src/app/modelo/flujos/formacion/paginacion-postulantes-validos';
import { PostulanteValido } from 'src/app/modelo/flujos/formacion/postulante-valido';
import { PruebaDetalle } from 'src/app/modelo/flujos/formacion/prueba-detalle';
import { PruebaDetalleDatos } from 'src/app/modelo/flujos/formacion/prueba-detalle-datos';
import { FormacionService } from 'src/app/servicios/formacion/formacion.service';
import { PruebaDetalleService } from 'src/app/servicios/formacion/prueba-detalle.service';
import { SubtipoPruebaService } from 'src/app/servicios/subtipo-prueba.service';
import { ComponenteBase } from 'src/app/util/componente-base';
import { FORMACION } from 'src/app/util/constantes/fomacion.const';
import { Notificacion } from 'src/app/util/notificacion';
import { PostulantesValidosService } from '../../../../servicios/formacion/postulantes-validos.service';
import { ResultadosPruebasService } from '../../../../servicios/formacion/resultados-prueba.service';
import { PaginacionResultadosPruebasDatos } from 'src/app/modelo/flujos/formacion/paginacion-resultados-pruebas-datos';
import { ResultadosPruebasDatos } from 'src/app/modelo/flujos/formacion/resultados-pruebas-datos';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { Usuario } from 'src/app/modelo/admin/usuario';
import { DocumentoFormacion } from 'src/app/modelo/flujos/formacion/documento';
import { FormGroup } from '@angular/forms';
import { DocumentoPruebaService } from 'src/app/servicios/formacion/documento-prueba.service';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { EstudianteService } from '../../../../servicios/formacion/estudiante.service';
import { TipoFiltroPostulantesValidosEnum } from '../../../../enum/tipo-filtro-postulantes-validos';

@Component({
  selector: 'app-resultados-pruebas',
  templateUrl: './resultados-pruebas.component.html',
  styleUrls: ['./resultados-pruebas.component.scss'],
})
export class ResultadosPruebasComponent extends ComponenteBase implements OnInit {
  FORMACION = FORMACION;
  TipoFiltroPostulantesValidosEnum = TipoFiltroPostulantesValidosEnum;
  fechaActual = new Date();

  // datos
  listaPruebaDetalleDatos: PruebaDetalleDatos[];
  pruebaDetalleSeleccionada: PruebaDetalleDatos;
  tipoResultado: string; // tipo de resultado de la prueba seleccionada

  listaPostulantesValidos: PostulanteValido[];
  paginacionPostulantesValidos: PaginacionPostulantesValidos;
  tipoFiltroPostulantesValidos: string;
  valorFiltroPostulantesValidos: string;

  listaResultadosPruebas: ResultadosPruebasDatos[];
  paginacionResultadosPruebas: PaginacionResultadosPruebasDatos;

  // estado proceso
  esEstadoPruebas = false;

  // componentes
  @ViewChild('table') table: any;
  @ViewChild('archivoMdbInput') inputArchivo: any;

  // eventos
  addRow = false;
  estaEditando = false;
  editIndex: number;
  codigo: number;

  // paginación
  currentPage = 1;
  size = 50;
  first = false;
  last = false;
  totalPages = 0;

  // orden
  orden = 'ID';

  // resultadosPruebas paginación
  ordenColumna = 2; // 2: ID, 3: NOMBRE, 4: CEDULA, 5: CORREO
  currentPageResultados = 1;
  sizeResultados = 50;
  firstResultados = false;
  lastResultados = false;
  totalPagesResultados = 0;

  // usuario actual (funcionario)
  usuario: Usuario;

  // headers
  /*
  idPostulante: string;
    cedula: string;
    correoPersonal: string;
    nombre: string;
    apellido: string;
   */
  headers = [
    {
      key: 'idPostulante',
      label: 'ID',
    },
    {
      key: 'nombre',
      label: 'Nombre',
    },
    {
      key: 'cedula',
      label: 'Cédula',
    },
    {
      key: 'correoPersonal',
      label: 'Correo Personal',
    },
  ];

  // headers resultadosPruebas
  headersResultadosPruebas = [
    {
      key: 'idPostulante',
      label: 'ID',
    },
    {
      key: 'cedula',
      label: 'Cédula',
    },
    {
      key: 'nombre',
      label: 'Nombre',
    },
    {
      key: 'resultado',
      label: 'Resultado',
    },
  ];

  // archivo de resultados
  archivo: File;
  @ViewChild('archivoMdbInput') archivoComponent: any;

  // gestión de archivos
  documentos: DocumentoFormacion[] = [];
  archivoPrueba: File = null;
  headersArchivos = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
  ];

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private mdbPopconfirmServiceLocal: MdbPopconfirmService,
    private formacionService: FormacionService,
    private pruebaDetalleService: PruebaDetalleService,
    private postulantesValidosService: PostulantesValidosService,
    private resultadosPruebasService: ResultadosPruebasService,
    private autenticacionService: AutenticacionService,
    // gestión archivos pruebas
    private documentoPruebaService: DocumentoPruebaService,
    private estudianteService: EstudianteService
  ) {
    super(notificationServiceLocal, mdbPopconfirmServiceLocal);

    this.showLoading = false;

    this.autenticacionService.user$.subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      },
    });
  }

  ngOnInit(): void {
    //console.log(this.archivoComponent);

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

            this.cargarPostulantesValidos();
          }
        },
      });

    //TODO borrar
    /* this.esEstadoPruebas = true;

    this.cargaListaPruebas();
    this.cargarPostulantesValidos(); */
    //TODO FIN borrar
  }

  ////////////////////////////
  // postulantes válidos
  ////////////////////////////

  // cargar lista de postulantes validos del servicio postulantesValidosService

  cargarPostulantesValidos() {
    this.showLoading = true;
    this.subscriptions.push(
      this.postulantesValidosService.listarPaginado(this.currentPage - 1, this.size, this.orden).subscribe({
        next: (paginacion: PaginacionPostulantesValidos) => {
          this.paginacionPostulantesValidos = paginacion;
          this.listaPostulantesValidos = paginacion.content;
          this.listaPostulantesValidos = [...this.listaPostulantesValidos];

          this.first = paginacion.first;
          this.last = paginacion.last;
          this.totalPages = paginacion.totalPages;

          this.showLoading = false;
        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          this.showLoading = false;
        },
      })
    );
  }

  onPageChange(direction: string) {
    if (direction === 'next') {
      // validar que no se pase de la última página
      if (this.currentPage === this.totalPages) {
        return;
      }
      this.currentPage++;
    } else {
      // validar que no se pase de la primera página
      if (this.currentPage === 1) {
        return;
      }
      this.currentPage--;
    }

    this.cargarPostulantesValidos();
  }

  // buscar postulantes válidos por filtro con servicio postulantesValidosService
  buscarPostulantesValidos() {
    this.showLoading = true;
    // verifica vacíos en tipo filtro y valor filtro
    if (this.tipoFiltroPostulantesValidos === '' || this.valorFiltroPostulantesValidos === '') {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Debe seleccionar un tipo de filtro y un valor para realizar la búsqueda'
      );

      this.showLoading = false;

      return;
    }

    // verificar que longitud mínima de valor sea 4
    if (this.valorFiltroPostulantesValidos.length < 4) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Debe ingresar al menos 4 caracteres para realizar la búsqueda'
      );

      this.showLoading = false;

      return;
    }

    this.subscriptions.push(
      this.postulantesValidosService
        .buscarPorFiltro(this.tipoFiltroPostulantesValidos, this.valorFiltroPostulantesValidos)
        .subscribe({
          next: (lista: PostulanteValido[]) => {
            this.listaPostulantesValidos = lista;
            this.listaPostulantesValidos = [...this.listaPostulantesValidos];

            this.showLoading = false;
          },
          error: (errorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);

            this.showLoading = false;
          },
        })
    );
  }

  resetFiltroPostulantesValidos() {
    this.tipoFiltroPostulantesValidos = '';
    this.valorFiltroPostulantesValidos = '';
    this.cargarPostulantesValidos();
  }

  cargaListaPruebas() {

    this.showLoading = true;

    this.subscriptions.push(
      this.pruebaDetalleService.listarConDatosTipoPrueba().subscribe({
        next: (lista: PruebaDetalleDatos[]) => {
          this.listaPruebaDetalleDatos = lista;

          // establecer la prueba seleccionada a la primera activa
          for (let index = 0; index < this.listaPruebaDetalleDatos.length; index++) {

            // si no es la última, verifica el estado
            if (index < this.listaPruebaDetalleDatos.length - 1) {


              if (this.listaPruebaDetalleDatos[index].estado !== FORMACION.estadoPruebasCierre) {
                this.pruebaDetalleSeleccionada = this.listaPruebaDetalleDatos[index];

                // filtra solo las pruebas que no tengan codCursoEspecializacion
                this.listaPruebaDetalleDatos = this.listaPruebaDetalleDatos.filter(
                  (prueba) => prueba.codCursoEspecializacion === null
                );

                this.listaPruebaDetalleDatos = [...this.listaPruebaDetalleDatos];


                this.cargarResultadosPrueba();

                this.obtenerTipoResultado();

                this.listarArchivosPrueba();

                this.showLoading = false;

                break;

              }
            } else {
              this.pruebaDetalleSeleccionada = this.listaPruebaDetalleDatos[index];

              this.cargarResultadosPrueba();

              this.obtenerTipoResultado();

              this.listarArchivosPrueba();

              this.showLoading = false;

            }
          }
        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);

          this.showLoading = false;
        },
      })
    );
  }

  // carga lista de resultados para la prueba seleccionada desde el servicio resultadosPruebaService
  cargarResultadosPrueba() {
    this.subscriptions.push(
      this.resultadosPruebasService
        .listarPaginado(
          this.currentPageResultados - 1,
          this.sizeResultados,
          this.pruebaDetalleSeleccionada.codSubtipoPrueba,
          this.ordenColumna
        )
        .subscribe({
          next: (paginacion: PaginacionResultadosPruebasDatos) => {
            this.paginacionResultadosPruebas = paginacion;
            this.listaResultadosPruebas = paginacion.content;
            this.listaResultadosPruebas = [...this.listaResultadosPruebas];

            this.firstResultados = paginacion.first;
            this.lastResultados = paginacion.last;
            this.totalPagesResultados = paginacion.totalPages;

            //console.log(this.listaResultadosPruebas);
          },
          error: (errorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          },
        })
    );
  }

  onOrdenChange($event) {
    this.orden = $event;
    console.log(this.orden);

    this.cargarPostulantesValidos();
  }

  /////////////////////////////////////////////////
  // registro de resultados
  /////////////////////////////////////////////////

  // selección de prueba para el registro de resultados
  onPruebaSeleccionada($event) {
    this.showLoading = true;

    this.pruebaDetalleSeleccionada = $event;

    this.listaResultadosPruebas = [];

    this.cargarResultadosPrueba();

    this.obtenerTipoResultado();

    this.listarArchivosPrueba();

    this.showLoading = false;
  }

  // obtiene el tipo de resultado de la prueba seleccionada. servicio pruebaDetalleService
  private obtenerTipoResultado() {
    this.subscriptions.push(
      this.pruebaDetalleService.tipoResultadoPorPrueba(this.pruebaDetalleSeleccionada.codSubtipoPrueba).subscribe({
        next: (tipoResultado) => {
          //console.log(tipoResultado);
          this.tipoResultado = tipoResultado;
        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  onPageChangeResultados(direction: string) {
    if (direction === 'next') {
      // validar que no se pase de la última página
      if (this.currentPageResultados === this.totalPagesResultados) {
        return;
      }
      this.currentPageResultados++;
    } else {
      // validar que no se pase de la primera página
      if (this.currentPageResultados === 1) {
        return;
      }
      this.currentPageResultados--;
    }

    this.cargarResultadosPrueba();
  }

  cargarArchivo(event: any) {
    this.showLoading = true;

    this.archivo = event.target.files[0];

    // cargar archivo de resultados con los parámetros de prueba seleccionada
    this.subscriptions.push(
      this.resultadosPruebasService
        .cargarPlantilla(
          this.archivo,
          this.pruebaDetalleSeleccionada.codPruebaDetalle,
          //this.usuario.codUsuario, el campo cod_funcionario es para pruebas bomberiles
          this.tipoResultado,
          this.pruebaDetalleSeleccionada.esFisica
        )
        .subscribe({
          next: (resultado) => {
            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Archivo cargado correctamente'
            );

            this.listaResultadosPruebas = [];

            this.cargarResultadosPrueba();

            this.inputArchivo.value = '';

            this.showLoading = false;
          },
          error: (errorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);

            this.inputArchivo.value = '';

            this.showLoading = false;
          },
        })
    );
  }

  ///////////////////////////////////////////
  // gestión archivos pruebas
  ///////////////////////////////////////////

  listarArchivosPrueba() {
    this.documentoPruebaService.listar(this.pruebaDetalleSeleccionada.codPruebaDetalle).subscribe((documentos) => {
      this.documentos = documentos;
    });
  }

  descargarArchivo(documento: DocumentoFormacion) {
    this.documentoPruebaService.descargar(documento.codDocumento).subscribe({
      next: (data) => {
        const blob = new Blob([data] /*, { type: 'application/pdf' }*/);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${ documento.nombre }`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.log('Error al descargar documento', error);
        Notificacion.notificar(this.notificationServiceLocal, 'Error al descargar documento', TipoAlerta.ALERTA_ERROR);
      },
    });
  }

  cargarArchivoPrueba(event: any) {
    this.archivoPrueba = event.target.files[0];
  }

  crear() {
    if (this.archivoPrueba === null) return;

    const formData = new FormData();
    formData.append('pruebaDetalle', this.pruebaDetalleSeleccionada.codPruebaDetalle.toString());
    formData.append('archivo', this.archivoPrueba);

    this.documentoPruebaService
      .guardarArchivo(formData)
      .pipe(
        tap(() => {
          this.documentoPruebaService
            .listar(this.pruebaDetalleSeleccionada.codPruebaDetalle)
            .subscribe((documentos) => {
              this.documentos = documentos;
              Notificacion.notificar(
                this.notificationServiceLocal,
                'Documento creado correctamente',
                TipoAlerta.ALERTA_OK
              );
            });
          this.addRow = false;
        }),
        catchError((error) => {
          console.log('Error al crear documento', error);
          Notificacion.notificar(this.notificationServiceLocal, 'Error al crear documento', TipoAlerta.ALERTA_ERROR);
          this.addRow = false;
          return throwError(error);
        })
      )
      .subscribe();
  }

  eliminar(codDocumento: number) {
    const codPruebaDetalle = this.pruebaDetalleSeleccionada.codPruebaDetalle;

    this.documentoPruebaService.eliminar(codPruebaDetalle, codDocumento).subscribe({
      next: () => {
        let index = this.documentos.findIndex((documento) => documento.codDocumento == codDocumento);
        this.documentos.splice(index, 1);
        this.documentos = [...this.documentos];
        Notificacion.notificar(
          this.notificationServiceLocal,
          'Documento eliminado correctamente',
          TipoAlerta.ALERTA_OK
        );
      },
      error: (error) => {
        console.log('Error al eliminar documento', error);
        Notificacion.notificar(this.notificationServiceLocal, 'Error al eliminar documento', TipoAlerta.ALERTA_ERROR);
      },
    });
  }

  ///////////////////////////////////////////
  // gestión resultados pruebas
  ///////////////////////////////////////////


  descargarLista(tipo: string) {
    this.showLoading = true;

    const contentType = tipo === 'Pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    this.resultadosPruebasService.descargar(tipo, this.pruebaDetalleSeleccionada.codSubtipoPrueba,
      this.pruebaDetalleSeleccionada.descripcionPrueba).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resultadosRegistrados' + this.pruebaDetalleSeleccionada.descripcionPrueba + '.' + (tipo === 'Pdf' ? 'pdf' : 'xlsx');
        link.click();
        window.URL.revokeObjectURL(url);

        this.showLoading = false;
      },
      error: (error) => {
        console.log('Error al descargar documento', error);
        Notificacion.notificar(this.notificationServiceLocal, 'Error al descargar documento', TipoAlerta.ALERTA_ERROR);

        this.showLoading = false;
      },
    });
  }

  /*  descargarLista(tipo: string) {
      // descargar mediante servicio ResultadosPruebasService
      this.subscriptions.push(
        this.resultadosPruebasService.descargar(tipo, this.pruebaDetalleSeleccionada.codPruebaDetalle,
          this.pruebaDetalleSeleccionada.descripcionPrueba).subscribe({
          next: () => {
            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Archivo descargado correctamente'
            );
          },
          error: (errorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          }
        })
      );
    }*/

  public confirmaCerrarRegistro(event: Event): void {

    // verifica si la selección actual ya está cerrada, si está cerrada no hace nada
    if (this.pruebaDetalleSeleccionada.estado === FORMACION.estadoPruebasCierre) {
      return;
    }

    if (this.verificarPruebaAnteriorAbierta()) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'No se puede cerrar el registro de resultados, existen pruebas anteriores sin cerrar'
      );
      return;
    }

    if (this.verificarUltimaPrueba()) {
      this.mensajeConfirmacion =
        '¿Está seguro de cerrar el registro de resultados? Al confirmar ya no será posible cargar más resultados para esta prueba. Al cierre de la última fase de pruebas, se registrará de forma automática  a los postulantes que aprobaron la fase de pruebas como estudiantes de acuerdo a los cupos disponibles.';
    } else {
      this.mensajeConfirmacion =
        '¿Está seguro de cerrar el registro de resultados? Al confirmar ya no será posible cargar más resultados para esta prueba.';
    }

    this.codigo = this.pruebaDetalleSeleccionada.codPruebaDetalle;
    super.openPopconfirm(event, this.cerrarRegistroConfirmado.bind(this), this.cerrarRegistroCancelado.bind(this));
  }

  cerrarRegistroConfirmado() {
    this.pruebaDetalleSeleccionada.estado = FORMACION.estadoPruebasCierre;

    // actualiza el estado de pruebaDetalle a cerrado con servicio PruebaDetalleService
    this.subscriptions.push(
      this.pruebaDetalleService
        .actualizar(this.pruebaDetalleSeleccionada, this.pruebaDetalleSeleccionada.codPruebaDetalle)
        .subscribe({
          next: (resultado) => {
            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Registro cerrado correctamente'
            );

            this.enviarNotificacion();

            this.generarDocumentosAprobados();
            this.generarListaReprobados();

            // en caso de que corresponda a la última prueba, se realiza la creación de estudiantes
            if (this.verificarUltimaPrueba()) {
              // llamada a this.estudianteService.crearEstudiantes();
              this.subscriptions.push(
                this.estudianteService.crearEstudiantes().subscribe({
                  next: (resultado) => {
                    Notificacion.notificacionOK(
                      this.notificationRef,
                      this.notificationServiceLocal,
                      'Estudiantes creados correctamente'
                    );
                  },
                  error: (errorResponse) => {
                    Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
                  },
                })
              );
            }
          },
          error: (errorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          },
        })
    );
  }

  //enviar notificación a postulantes aprobados con servicio resultadosPruebaService método notificarPrueba
  enviarNotificacion() {

    // verifica si la prueba seleccionada está en estado cierre, si no está en estado cierre no hace nada
    if (this.pruebaDetalleSeleccionada.estado !== FORMACION.estadoPruebasCierre) {

      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'No se puede enviar notificación, la prueba seleccionada no se encuentra cerrada'
      );

      return;
    }

    this.showLoading = true;

    this.subscriptions.push(
      this.resultadosPruebasService.notificarAprobados(this.pruebaDetalleSeleccionada.codSubtipoPrueba, this.verificarUltimaPrueba()).subscribe({
        next: (resultado) => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Notificación enviada correctamente'
          );

          this.showLoading = false;
        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);

          this.showLoading = false;
        },
      })
    );
  }

  cerrarRegistroCancelado() {
    console.log('cerrar registro');
  }

  // verificar si en la lista de pruebaDetalle hay una prueba anterior que no se encuentre cerrada
  //
  verificarPruebaAnteriorAbierta() {
    if (this.pruebaDetalleSeleccionada.ordenTipoPrueba == 1) {
      return false;
    }

    // obtiene el orden de la prueba seleccionada y recorre la lista de pruebaDetalle hacia atrás para buscar si hay una prueba anterior abierta

    const ordenActual = this.pruebaDetalleSeleccionada.ordenTipoPrueba;

    for (let i = ordenActual - 1; i >= 1; i--) {
      let pruebaAnterior = this.listaPruebaDetalleDatos.find(
        (prueba) => prueba.ordenTipoPrueba == i && prueba.estado !== FORMACION.estadoPruebasCierre
      );

      if (pruebaAnterior) {
        return true;
      }
    }
  }

  // generar documentos de aprobados. Servicio resultadosPruebaService método generarDocumentosAprobados
  generarDocumentosAprobados() {
    this.subscriptions.push(
      this.resultadosPruebasService
        .generarDocumentosAprobados(this.pruebaDetalleSeleccionada.codSubtipoPrueba)
        .subscribe({
          next: (resultado) => {
            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Documentos generados correctamente'
            );

            // obtener nuevamente los documentos por prueba
            this.documentos = [];
            this.listarArchivosPrueba();
          },
          error: (errorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          },
        })
    );
  }

  // verifica si todoas las pruebas de la lista de pruebaDetalle están cerradas
  verificarPruebasCerradas() {
    let pruebaAbierta = this.listaPruebaDetalleDatos.find((prueba) => prueba.estado !== FORMACION.estadoPruebasCierre);

    if (pruebaAbierta) {
      return false;
    } else {
      return true;
    }
  }

  // verifica si la prueba seleccionada corresponde a la última prueba de la lista de pruebaDetalle
  verificarUltimaPrueba() {
    let cantidadPruebas = this.listaPruebaDetalleDatos.length;

    if (this.pruebaDetalleSeleccionada.ordenTipoPrueba === cantidadPruebas) {
      return true;
    } else {
      return false;
    }
  }

  generarListaReprobados() {
    this.subscriptions.push(
      this.resultadosPruebasService
        .generarDocumentosReprobados(this.pruebaDetalleSeleccionada.codSubtipoPrueba)
        .subscribe({
          next: (resultado) => {
            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Documentos generados correctamente'
            );

            // obtener nuevamente los documentos por prueba
            this.documentos = [];
            this.listarArchivosPrueba();
          },
          error: (errorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          },
        })
    );
  }
}
