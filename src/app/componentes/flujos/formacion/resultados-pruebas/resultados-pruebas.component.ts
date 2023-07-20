import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { catchError, of, first } from 'rxjs';
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

@Component({
  selector: 'app-resultados-pruebas',
  templateUrl: './resultados-pruebas.component.html',
  styleUrls: ['./resultados-pruebas.component.scss'],
})
export class ResultadosPruebasComponent extends ComponenteBase implements OnInit {
  // datos
  listaPruebaDetalleDatos: PruebaDetalleDatos[];
  pruebaDetalleSeleccionada: PruebaDetalleDatos;
  tipoResultado: string; // tipo de resultado de la prueba seleccionada

  listaPostulantesValidos: PostulanteValido[];
  paginacionPostulantesValidos: PaginacionPostulantesValidos;

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
      key: 'resultado',
      label: 'Resultado',
    },
  ];

  // archivo de resultados
  archivo: File;
  @ViewChild('archivoMdbInput') archivoComponent: any;
  
  

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private mdbPopconfirmServiceLocal: MdbPopconfirmService,
    private formacionService: FormacionService,
    private pruebaDetalleService: PruebaDetalleService,
    private postulantesValidosService: PostulantesValidosService,
    private resultadosPruebasService: ResultadosPruebasService,
    private autenticacionService: AutenticacionService,
  ) {
    super(notificationServiceLocal, mdbPopconfirmServiceLocal);

    this.autenticacionService.user$.subscribe({
      next: usuario => {
        this.usuario = usuario
      }
    })
  }

  ngOnInit(): void {

    console.log(this.archivoComponent);

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
    this.esEstadoPruebas = true;

    this.cargaListaPruebas();
    this.cargarPostulantesValidos();
    //TODO FIN borrar
  }

  // cargar lista de postulantes validos del servicio postulantesValidosService

  cargarPostulantesValidos() {
    this.subscriptions.push(
      this.postulantesValidosService.listarPaginado(this.currentPage - 1, this.size, this.orden).subscribe({
        next: (paginacion: PaginacionPostulantesValidos) => {
          this.paginacionPostulantesValidos = paginacion;
          this.listaPostulantesValidos = paginacion.content;
          this.listaPostulantesValidos = [...this.listaPostulantesValidos];

          this.first = paginacion.first;
          this.last = paginacion.last;
          this.totalPages = paginacion.totalPages;
        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
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

  cargaListaPruebas() {
    this.subscriptions.push(
      this.pruebaDetalleService.listarConDatosTipoPrueba().subscribe({
        next: (lista: PruebaDetalleDatos[]) => {
          this.listaPruebaDetalleDatos = lista;

          // establecer la prueba seleccionada a la primera activa
          for (let index = 0; index < this.listaPruebaDetalleDatos.length; index++) {
            if (this.listaPruebaDetalleDatos[index].estado !== FORMACION.estadoPruebasCierre) {
              this.pruebaDetalleSeleccionada = this.listaPruebaDetalleDatos[index];

              this.cargarResultadosPrueba();

              this.obtenerTipoResultado();

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

            console.log(this.listaResultadosPruebas);
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
    this.pruebaDetalleSeleccionada = $event;

    this.listaResultadosPruebas = [];

    this.cargarResultadosPrueba();

    this.obtenerTipoResultado();
    
    
  }
  
  // obtiene el tipo de resultado de la prueba seleccionada. servicio pruebaDetalleService
  private obtenerTipoResultado() {
    this.subscriptions.push(
      this.pruebaDetalleService.tipoResultadoPorPrueba(this.pruebaDetalleSeleccionada.codSubtipoPrueba)
        .subscribe({
          next: (tipoResultado) => {
            console.log(tipoResultado);
            this.tipoResultado = tipoResultado;
          },
          error: (errorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          }
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

    console.log(event.target);

    console.log(this.inputArchivo);

    this.archivo = event.target.files[0];
    
    // cargar archivo de resultados con los parátros de prueba seleccionada
    this.subscriptions.push(
      this.resultadosPruebasService.cargarPlantilla(
        this.archivo,
        this.pruebaDetalleSeleccionada.codPruebaDetalle,
        //this.usuario.codUsuario, el campo cod_funcionario es para pruebas bomberiles
        this.tipoResultado,
        this.pruebaDetalleSeleccionada.esFisica
        ).subscribe({
          next: (resultado) => {  
            
            Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, "Archivo cargado correctamente");

            this.listaResultadosPruebas = [];
            
            this.cargarResultadosPrueba();

            this.inputArchivo.value = "";
          },
          error: (errorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);

            this.inputArchivo.value = "";
          }
        })
    );


  }
}
