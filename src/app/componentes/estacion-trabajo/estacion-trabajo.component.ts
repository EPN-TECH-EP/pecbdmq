import {UnidadGestion} from '../../modelo/admin/unidad-gestion';
import {Component, OnInit} from '@angular/core';
import {ViewChild} from '@angular/core';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {
  MdbPopconfirmRef,
  MdbPopconfirmService,
} from 'mdb-angular-ui-kit/popconfirm';
import {UnidadGestionService} from 'src/app/servicios/unidad-gestion.service';
import {Observable, Subscription} from 'rxjs';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Notificacion} from 'src/app/util/notificacion';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';
import {HeaderType} from 'src/app/enum/header-type.enum';
import {CambiosPendientes} from 'src/app/modelo/util/cambios-pendientes';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {ComponenteBase} from 'src/app/util/componente-base';
import {ValidacionUtil} from 'src/app/util/validacion-util';
import { EstacionTrabajo, EstacionTrabajoService } from 'src/app/servicios/estacion-trabajo.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { Canton } from 'src/app/modelo/admin/canton';
import { Provincia } from 'src/app/modelo/admin/provincia';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-estacion-trabajo',
  templateUrl: './estacion-trabajo.component.html',
  styleUrls: ['./estacion-trabajo.component.scss'],
})
export class EstacionTrabajoComponent extends ComponenteBase implements OnInit, CambiosPendientes {
  
  estaciones: EstacionTrabajo[];
  estacion: EstacionTrabajo;
  estacionEditForm: EstacionTrabajo;
  provincias: Provincia[];
  cantones: Canton[];
  estacionForm: FormGroup;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[];

  // codigo de item a modificar o eliminar
  codigo: number;
  data: EstacionTrabajo;
  showLoading = false;

  validacionUtil = ValidacionUtil;

  //options
  options = [
    {value: 'ACTIVO', label: 'ACTIVO'},
    {value: 'INACTIVO', label: 'INACTIVO'},
  ];

  //table
  @ViewChild('table') table!: MdbTableDirective<EstacionTrabajo>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Nombre'];

  /**
    * Inicializa un nuevo objeto "Estacion Trabajo" con valores por defecto.
    * 
    * @returns {EstacionTrabajo} Un objeto "Estacion Trabajo" con valores predeterminados.
  */
  initializeEstacion(): EstacionTrabajo {
    return {
      codigo: 0,
      nombre: '',
      nombreCanton: '',
      nombreProvincia: '',
      provincia: 0,
      canton: 0,
      estado: 'ACTIVO',
    };
  }


  constructor(
    private apiEstacion: EstacionTrabajoService,
    private builder: FormBuilder,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private provinciaService: ProvinciaService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
    this.estacionForm = new FormGroup({});
    this.estaciones = [];
    this.cantones = [];
    this.provincias = [];
  
    this.estacion = this.initializeEstacion();// Llamada al método initializeEstacion
    this.estacionEditForm = this.initializeEstacion();// Llamada al método initializeEstacion
  }

  ngOnInit(): void {
    this.provinciaService.getProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias;
      },
      error: () => {
        console.error('error al listar tipos de procedencia');
      }
    })

    this.subscriptions.push(
    this.apiEstacion.listar().subscribe((data) => {
      this.estaciones = data;
      })
    );

    this.estacionForm = this.builder.group({
      nombre: ['', Validators.required],
      codProvincia: ['', Validators.required],
      codCanton: ['', Validators.required],
    })
  }

  get codCanton() {
    return this.estacionForm.get('codCanton');
  }

  get codProvincia() {
    return this.estacionForm.get('codProvincia');
  }

  get nombre() {
    return this.estacionForm.get('nombre');
  }

  //registro
  public registro(): void {
    let estacion : EstacionTrabajo;
    this.estacionForm.patchValue({
      nombre: estacion.nombre,
      codCanton: estacion.canton,
    });

    (estacion = {...estacion, estado: 'ACTIVO'}), (this.showLoading = true);
    this.subscriptions.push(
      this.apiEstacion.crear(estacion).subscribe({
        next: (response: HttpResponse<EstacionTrabajo>) => {
          let nuevaEstacion: EstacionTrabajo = response.body;
          this.estaciones.push(nuevaEstacion);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Estación de trabajo creada con éxito');

          this.estacion = this.initializeEstacion();// Llamada al método initializeEstacion
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.estacionEditForm = {...this.estaciones[index]};
    this.patchFormulario();
  }

  patchFormulario() {
    this.estacionForm.patchValue({
      nombre: this.estacion.nombre,
      codProvincia: this.estacion.provincia,
      codCanton: this.estacion.canton,
    });
  }

  undoRow() {
    this.estacionEditForm = this.initializeEstacion();// Llamada al método initializeUnidad
    this.editElementIndex = -1;
  }

  //actualizar
  public actualizar(estacion: EstacionTrabajo): void {

    estacion = {...estacion, estado: 'ACTIVO'};

    this.showLoading = true;
    this.subscriptions.push(
      this.apiEstacion.actualizar(estacion, estacion.codigo).subscribe({
        next: (response: HttpResponse<EstacionTrabajo>) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Estación de trabajo actualizada con éxito');
          this.estaciones[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.estacion = this.initializeEstacion();// Llamada al método i
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          this.showLoading = false;
        },
      })
    );
  }


  //eliminar
  public confirmaEliminar(event: Event, codigo: number, data: EstacionTrabajo): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    this.data = data;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.apiEstacion.eliminar(this.codigo).subscribe({
        next: (response: string) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Estación de trabajo eliminada con éxito');
          const index = this.estaciones.indexOf(this.data);
          this.estaciones.splice(index, 1);
          this.estaciones = [...this.estaciones]
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          console.log(errorResponse);
          this.showLoading = false;
        },
      })
    )
  }

  onChangeCanton(event: any) {
    if (event === '') return;
    this.provinciaService.getCantonesPorProvincia(event).subscribe({
      next: (cantones) => {
        //this.formularioDatoPersonal.get('canton')?.enable();
        this.cantones = cantones;
        this.estacionEditForm.canton = 0;
      },
      error: (err) => {console.log(err)}
    });
  }

  cambiosPendientes(): boolean {
    return this.editElementIndex !== -1;
  }

}
