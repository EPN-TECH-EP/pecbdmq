import {Component, OnInit} from '@angular/core';
import {TipoFiltroPostulantesValidosEnum} from "../../../../enum/tipo-filtro-postulantes-validos";
import {ComponenteBase} from "../../../../util/componente-base";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {FormacionService} from "../../../../servicios/formacion/formacion.service";
import {PruebaDetalleService} from "../../../../servicios/formacion/prueba-detalle.service";
import {PostulantesValidosService} from "../../../../servicios/formacion/postulantes-validos.service";
import {ResultadosPruebasService} from "../../../../servicios/formacion/resultados-prueba.service";
import {AutenticacionService} from "../../../../servicios/autenticacion.service";
import {DocumentoPruebaService} from "../../../../servicios/formacion/documento-prueba.service";
import {EstudianteService} from "../../../../servicios/formacion/estudiante.service";
import {PostulanteValido} from "../../../../modelo/flujos/formacion/postulante-valido";
import {PaginacionPostulantesValidos} from "../../../../modelo/flujos/formacion/paginacion-postulantes-validos";
import {Notificacion} from "../../../../util/notificacion";

@Component({
  selector: 'app-monitor-inscripciones',
  templateUrl: './monitor-inscripciones.component.html',
  styleUrls: ['./monitor-inscripciones.component.scss']
})
export class MonitorInscripcionesComponent extends ComponenteBase implements OnInit {

  TipoFiltroPostulantesEnum = TipoFiltroPostulantesValidosEnum;

  listaPostulantes: PostulanteValido[];
  paginacionPostulantes: PaginacionPostulantesValidos;
  tipoFiltroPostulantes: string;
  valorFiltroPostulantes: string;

  // paginación
  currentPage = 1;
  size = 50;
  first = false;
  last = false;
  totalPages = 0;

  // orden
  orden = 'ID';

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

  constructor(private notificationServiceLocal: MdbNotificationService,
              private mdbPopconfirmServiceLocal: MdbPopconfirmService,
              private postulantesValidosService: PostulantesValidosService,
  ) {
    super(notificationServiceLocal, mdbPopconfirmServiceLocal);

    this.showLoading = false;
  }

  ngOnInit(): void {
    this.cargarPostulantesValidos();
  }

  ////////////////////////////
  // postulantes válidos
  ////////////////////////////

  // cargar lista de postulantes validos del servicio postulantesValidosService

  cargarPostulantesValidos() {
    this.showLoading = true;
    this.subscriptions.push(
      this.postulantesValidosService.listarTodoPaginado(this.currentPage - 1, this.size, this.orden).subscribe({
        next: (paginacion: PaginacionPostulantesValidos) => {
          this.paginacionPostulantes = paginacion;
          this.listaPostulantes = paginacion.content;
          this.listaPostulantes = [...this.listaPostulantes];

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
    if (this.tipoFiltroPostulantes === '' || this.valorFiltroPostulantes === '') {
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
    if (this.valorFiltroPostulantes.length < 4) {
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
        .buscarTodoPorFiltro(this.tipoFiltroPostulantes, this.valorFiltroPostulantes)
        .subscribe({
          next: (lista: PostulanteValido[]) => {
            this.listaPostulantes = lista;
            this.listaPostulantes = [...this.listaPostulantes];

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
    this.tipoFiltroPostulantes = '';
    this.valorFiltroPostulantes = '';
    this.cargarPostulantesValidos();
  }

  onOrdenChange($event) {
    this.orden = $event;
    console.log(this.orden);

    this.cargarPostulantesValidos();
  }


}
