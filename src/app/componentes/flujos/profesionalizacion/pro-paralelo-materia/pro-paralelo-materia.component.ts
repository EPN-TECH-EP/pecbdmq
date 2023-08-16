import {Component, OnInit} from '@angular/core';
import {ProMateriaSemestreDto} from '../../../../modelo/flujos/profesionalizacion/pro-materia-semestre.models';
import {ProPeriodo} from '../../../../modelo/admin/profesionalizacion/pro-periodo';
import {
  defaultPeriodoSemestre,
  ProPeriodoSemestreDto
} from '../../../../modelo/flujos/profesionalizacion/pro-periodo-semestre.models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Materia} from '../../../../modelo/admin/materias';
import {Aula} from '../../../../modelo/admin/aula';
import {ProPeriodoSemestreService} from '../../../../servicios/profesionalizacion/pro-periodo-semestre.service';
import {ProPeriodoService} from '../../../../servicios/profesionalizacion/pro-periodo.service';
import {ProMateriaSemestreService} from '../../../../servicios/profesionalizacion/pro-materia-semestre.service';
import {ProMateriaService} from '../../../../servicios/profesionalizacion/pro-materia.service';
import {
  defaultParaleloMateria,
  ProMateriaParaleloCreateUpdateDto,
  ProMateriaParaleloDto
} from '../../../../modelo/flujos/profesionalizacion/pro-paralelo-materia.models';
import {ProMateriaParaleloService} from '../../../../servicios/profesionalizacion/pro-paralelo-materia.service';
import {Paralelo} from '../../../../modelo/admin/paralelo';
import {ProParaleloService} from '../../../../servicios/profesionalizacion/pro-paralelo.service';
import {ProProyectoService} from '../../../../servicios/profesionalizacion/pro-proyecto.service';
import {Proyecto} from '../../../../modelo/admin/profesionalizacion/pro-proyecto';
import {ComponenteBase} from '../../../../util/componente-base';
import {MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {TipoMateria} from '../../../../enum/materia-type.enum';
import {MdbTabChange} from 'mdb-angular-ui-kit/tabs/tabs.component';
import {HttpErrorResponse} from '@angular/common/http';
import {Notificacion} from '../../../../util/notificacion';

@Component({
  selector: 'app-pro-paralelo-materia',
  templateUrl: './pro-paralelo-materia.component.html',
  styleUrls: ['./pro-paralelo-materia.component.scss']
})
export class ProParaleloMateriaComponent extends ComponenteBase implements OnInit {
  tipoMateriaLabel: TipoMateria = TipoMateria.Materia;
  public shouldRender = false;

  constructor(
    private periodoSemestreService: ProPeriodoSemestreService,
    private periododService: ProPeriodoService,
    private materiaSemestreService: ProMateriaSemestreService,
    private proMateriaParaleloService: ProMateriaParaleloService,
    private builder: FormBuilder,
    private materiasService: ProMateriaService,
    private paraleloService: ProParaleloService,
    private proyectosService: ProProyectoService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal,
      popconfirmServiceLocal);
    this.headers = [
      {key: 'nombreParalelo', label: 'Paralelo'},
    ]
    this.listadoAsignacion = [];
    this.selectedItem = defaultParaleloMateria;
    this.formGroup = new FormGroup({});
    this.construirFormulario();
  }

  get codParalelo() {
    return this.formGroup.get('codParalelo');
  }

  get codProyecto() {
    return this.formGroup.get('codProyecto');
  }

  public get isMateria(): boolean {
    return this.tipoMateriaLabel === 'Materia';
  }

  selectedItem: ProMateriaParaleloDto;

  selectedItemPeriodo: number;
  selectedListPeriodos: ProPeriodo[];
  selectedItemSemestre: number;
  selectedListSemestres: ProPeriodoSemestreDto[];
  selectedListMateriaOrProyecto: ProMateriaSemestreDto[];
  listadoAsignacion: ProMateriaParaleloDto[] = undefined;
  listadoProyectos: Proyecto[];

  headers: { key: string, label: string }[];
  formGroup: FormGroup;
  codigoItemEditando: number;
  estaEditandoItem: boolean;
  estaAgregandoItem: boolean;

  protected readonly defaultItem = defaultPeriodoSemestre;
  materiasList: Materia[];
  paralelosList: Paralelo[];
  aulaList: Aula[];

  defaultMateriaParalelo = defaultParaleloMateria;

  selectedItemMateriaOrProyecto: ProMateriaSemestreDto;
  private codigo: number;


  protected readonly defaultParaleoMateria = defaultParaleloMateria;

  ngOnInit(): void {
    this.periododService.listar().subscribe((response) => {
      this.selectedListPeriodos = response;
    })

    this.materiasService.listar().subscribe((response) => {
      this.materiasList = response;
    })

    this.paraleloService.getParalelos().subscribe((response) => {
      this.paralelosList = response;
    })

    this.proyectosService.listar().subscribe((response) => {
      this.listadoProyectos = response;
    })

  }

  onCancelarEdicion() {
    this.selectedItem = defaultParaleloMateria;
    this.estaEditandoItem = false;
    this.codigoItemEditando = 0;
    this.estaAgregandoItem = false;
    this.formGroup.reset();
  }

  onEditarRegistroInstructor(item: ProMateriaParaleloDto) {
    this.estaEditandoItem = true;
    this.selectedItem = item;
    this.codigoItemEditando = item.codSemestreMateriaParalelo;
    this.matchDatosItemEnFormulario();
  }

  onAgregarItem() {
    this.selectedItem = {
      ...this.selectedItem,
      codSemestreMateria: this.selectedItemMateriaOrProyecto.codMateriaSemestre,
    };
    this.estaAgregandoItem = true;

  }

  onGuardarCambios() {
    this.editarItem(this.selectedItem);
  }

  private construirFormulario() {
    if (this.selectedItemMateriaOrProyecto?.esProyecto) {
      this.formGroup = this.builder.group({
        codParalelo: [null],
        codProyecto: ['', Validators.required]
      })
    } else {
      this.formGroup = this.builder.group({
        codParalelo: ['', Validators.required],
        codProyecto: [null]
      })
    }

  }

  private editarItem(item: ProMateriaParaleloDto) {
    this.selectedItem = {
      ...this.selectedItem,
      codParalelo: this.codParalelo?.value,
    }
    const itemRequest: ProMateriaParaleloCreateUpdateDto = {
      codParalelo: this.codParalelo?.value,
      codSemestreMateriaParalelo: this.selectedItem.codSemestreMateriaParalelo,
      codSemestreMateria: this.selectedItemMateriaOrProyecto.codMateriaSemestre,
      codProyecto: this.codProyecto?.value
    }
    const request = itemRequest.codSemestreMateriaParalelo == 0 ? this.proMateriaParaleloService.crear(itemRequest) : this.proMateriaParaleloService.actualizar(itemRequest, itemRequest.codSemestreMateriaParalelo);
    request.subscribe({
      next: (value) => {
        this.estaEditandoItem = false;
        this.selectedItem = defaultParaleloMateria;
        this.onCancelarEdicion();
        Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, "Registro guardado con exito!");
        this.proMateriaParaleloService.getAllByCodSemestreMateria(this.selectedItemMateriaOrProyecto.codMateriaSemestre).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          },
          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          }
        })
      },
      error: (errorResponse: HttpErrorResponse) => {
        Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
      }
    })
  }

  confirmarEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.onEliminarRegistro.bind(this));
  }

  onEliminarRegistro() {
    this.proMateriaParaleloService.eliminar(this.codigo).subscribe({
      next: (instructor) => {
        this.formGroup.reset();
        this.proMateriaParaleloService.getAllByCodSemestreMateria(this.selectedItemMateriaOrProyecto.codMateriaSemestre).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          },
          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          }
        })
      }
    });
  }

  private matchDatosItemEnFormulario() {
    this.formGroup.patchValue({
      codParalelo: this.selectedItem.codParalelo,
      codSemestreMateriaParalelo: this.selectedItem.codSemestreMateriaParalelo,
      codSemestreMateria: this.selectedItem.codSemestreMateria,
      codProyecto: this.selectedItem.codProyecto
    })
  }

  onSelectChange(event: any) {
    this.listadoAsignacion = undefined;
    this.periodoSemestreService.getAllByPeriodo(this.selectedItemPeriodo).subscribe({
      next: (result) => {
        if (result.length === 0) {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'No existen semestres para el periodo seleccionado');
        }
        this.selectedListSemestres = result;
      }
    });
  }

  onSelectChangeMateriaSemestre(event: any) {
    this.listadoAsignacion = undefined;
    console.log(this.listadoAsignacion)
    this.construirFormulario();
    this.materiaSemestreService.getAllByPeriodoSemestre(this.selectedItemSemestre).subscribe({
      next: (result) => {
        this.selectedListMateriaOrProyecto = result;
        if (result.length === 0) {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, `No existen  ${this.tipoMateriaLabel}s para el semestre seleccionado`);
        }
        this.filterMateriasByType();
      }
    });
  }

  onSelectChangeMateriaParalelo(event: any) {
    this.construirFormulario();
    this.headers = [
      {key: this.isMateria ? 'nombreParalelo' : 'nombreProyecto', label: this.isMateria ? 'Paralelo' : 'Proyecto'},
    ]
    this.proMateriaParaleloService.getAllByCodSemestreMateria(this.selectedItemMateriaOrProyecto.codMateriaSemestre).subscribe({
      next: (result) => {
        this.listadoAsignacion = result;
      }
    });
  }

  changeType(event: MdbTabChange): void {
    //this.shouldRender = false;
    setTimeout(() => {
      this.shouldRender = true;
    }, 200)
    this.selectedItemSemestre = null;
    this.selectedItemMateriaOrProyecto = null;
    this.estaAgregandoItem = false;
    this.selectedItemPeriodo = null;
    this.listadoAsignacion = [];
    this.tipoMateriaLabel = event.index === 0 ? TipoMateria.Materia : TipoMateria.Proyecto;
  }

  private filterMateriasByType() {
    this.selectedListMateriaOrProyecto = this.selectedListMateriaOrProyecto.filter(el => this.isMateria ? !el.esProyecto : el.esProyecto)
  }

  protected readonly undefined = undefined;
}
