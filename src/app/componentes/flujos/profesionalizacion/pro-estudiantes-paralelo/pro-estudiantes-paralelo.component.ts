import {Component, OnInit} from '@angular/core';
import {ProMateriaParaleloDto} from '../../../../modelo/flujos/profesionalizacion/pro-paralelo-materia.models';
import {ProPeriodo} from '../../../../modelo/admin/profesionalizacion/pro-periodo';
import {ProPeriodoSemestreDto} from '../../../../modelo/flujos/profesionalizacion/pro-periodo-semestre.models';
import {ProMateriaSemestreDto} from '../../../../modelo/flujos/profesionalizacion/pro-materia-semestre.models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Materia} from '../../../../modelo/admin/materias';
import {Paralelo} from '../../../../modelo/admin/paralelo';
import {Aula} from '../../../../modelo/admin/aula';
import {ProPeriodoSemestreService} from '../../../../servicios/profesionalizacion/pro-periodo-semestre.service';
import {ProPeriodoService} from '../../../../servicios/profesionalizacion/pro-periodo.service';
import {ProMateriaSemestreService} from '../../../../servicios/profesionalizacion/pro-materia-semestre.service';
import {ProMateriaParaleloService} from '../../../../servicios/profesionalizacion/pro-paralelo-materia.service';
import {ProMateriaService} from '../../../../servicios/profesionalizacion/pro-materia.service';
import {ProParaleloService} from '../../../../servicios/profesionalizacion/pro-paralelo.service';
import {ProParaleloEstudianteService} from '../../../../servicios/profesionalizacion/pro_paralelo-estudiante.service';
import {
  defaultParaleloEstuduante,
  ProParaleloEstudianteCreateUpdateDto,
  ProParaleloEstudianteDto
} from '../../../../modelo/flujos/profesionalizacion/pro-paralelo-estudiante.models';
import {ProPeriodoEstudianteService} from '../../../../servicios/profesionalizacion/pro-periodo-estudiante.service';
import {ProPeriodoEstudianteDto} from '../../../../modelo/flujos/profesionalizacion/pro-periodo-estudiante.models';
import {Notificacion} from '../../../../util/notificacion';
import {HttpErrorResponse} from '@angular/common/http';
import {MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {MdbTabChange} from 'mdb-angular-ui-kit/tabs/tabs.component';
import {TipoMateria} from '../../../../enum/materia-type.enum';


@Component({
  selector: 'app-pro-estudiantes-paralelo',
  templateUrl: './pro-estudiantes-paralelo.component.html',
  styleUrls: ['./pro-estudiantes-paralelo.component.scss']
})
export class ProEstudiantesParaleloComponent implements OnInit {
  tipoMateriaLabel: TipoMateria = TipoMateria.Materia;
  public shouldRender = false;
  selectedItem: ProParaleloEstudianteDto;

  selectedItemPeriodo: number;
  selectedListPeriodos: ProPeriodo[];
  selectedItemSemestre: number;
  selectedListSemestres: ProPeriodoSemestreDto[];
  selectListMaterias: ProMateriaSemestreDto[];
  selectedListParalelos: ProMateriaParaleloDto[];
  listadoAsignacion: ProParaleloEstudianteDto[] = undefined;
  selectedListEstudiante: ProPeriodoEstudianteDto[];

  headers: { key: string, label: string }[];
  formGroup: FormGroup;
  codigoItemEditando: number;
  estaAgregandoItem: boolean;

  protected readonly defaultItem = defaultParaleloEstuduante;
  materiasList: Materia[];
  paralelosList: Paralelo[];
  aulaList: Aula[];

  defaultParaleloEstuduante = defaultParaleloEstuduante;

  selectedItemMateria: ProMateriaSemestreDto;

  selectedItemParalelo: number;
  notificationRef: MdbNotificationRef<AlertaComponent> | null;

  public get isMateria(): boolean {
    return this.tipoMateriaLabel === 'Materia';
  }

  constructor(
    private periodoSemestreService: ProPeriodoSemestreService,
    private periododService: ProPeriodoService,
    private materiaSemestreService: ProMateriaSemestreService,
    private proMateriaParaleloService: ProMateriaParaleloService,
    private builder: FormBuilder,
    private materiasService: ProMateriaService,
    private paraleloService: ProParaleloService,
    private proParaleloEstudianteService: ProParaleloEstudianteService,
    private periodoEstudianteService: ProPeriodoEstudianteService,
    private notificationServiceLocal: MdbNotificationService,
  ) {
    this.headers = [
      {key: 'cedula', label: 'Cédula'},
      {key: 'nombreEstudiante', label: 'Estudiante'},
    ]
    this.selectedItem = defaultParaleloEstuduante;
    this.formGroup = new FormGroup({});
    this.construirFormulario();
  }

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

  }

  onCancelarEdicion() {
    this.selectedItem = defaultParaleloEstuduante;
    this.codigoItemEditando = 0;
    this.estaAgregandoItem = false;
    this.formGroup.reset();
  }

  onEditarRegistroInstructor(item: ProParaleloEstudianteDto) {
    this.selectedItem = item;
    this.codigoItemEditando = item.codSemestreMateriaParalelo;
    this.matchDatosItemEnFormulario();
  }

  onAgregarItem() {
    this.selectedItem = {
      ...this.selectedItem,
      codSemestreMateriaParalelo: this.selectedItemParalelo,
    };
    this.estaAgregandoItem = true;
    this.construirFormulario();
  }

  onGuardarCambios() {
    this.editarItem(this.selectedItem);
  }

  private construirFormulario() {
    this.formGroup = this.builder.group({
      codEstudiante: ['', Validators.required],
      codSemestreMateriaParalelo: [this.selectedItemParalelo, Validators.required],
      codParaleloEstudiante: ['']
    })

    this.codigoItemEditando = -1;
  }

  private editarItem(item: ProParaleloEstudianteDto) {
    this.selectedItem = {
      ...this.selectedItem,
      codEstudiante: this.codEstudiante?.value,
    }
    const itemRequest: ProParaleloEstudianteCreateUpdateDto = {
      codEstudiante: this.codEstudiante?.value,
      codSemestreMateriaParalelo: item.codSemestreMateriaParalelo,
      codParaleloEstudiante: item.codParaleloEstudiante

    }
    const request = itemRequest.codParaleloEstudiante == 0 ? this.proParaleloEstudianteService.crear(itemRequest) : this.proParaleloEstudianteService.actualizar(itemRequest, itemRequest.codParaleloEstudiante);
    request.subscribe({
      next: (value) => {
        this.selectedItem = defaultParaleloEstuduante;
        this.onCancelarEdicion();
        Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, "Registro guardado con exito!");
        this.proParaleloEstudianteService.getAllByCodMateriaParalelo(this.selectedItemParalelo).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          }
        })
      },
      error: (errorResponse: HttpErrorResponse) => {
        Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
      }
    })
  }

  onEliminarRegistro(dato: ProParaleloEstudianteDto) {
    this.proParaleloEstudianteService.eliminar(dato.codParaleloEstudiante).subscribe({
      next: (instructor) => {
        this.formGroup.reset();
        this.proParaleloEstudianteService.getAllByCodMateriaParalelo(this.selectedItemParalelo).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          }
        })
      }
    });
  }

  get codEstudiante() {
    return this.formGroup.get('codEstudiante');
  }

  private matchDatosItemEnFormulario() {
    this.formGroup.patchValue({
      codEstudiante: this.selectedItem.codEstudiante,
      codSemestreMateriaParalelo: this.selectedItem.codSemestreMateriaParalelo,
      codParaleloEstudiante: this.selectedItem.codParaleloEstudiante
    })
  }

  onSelectChange(event: any) {

    this.periodoSemestreService.getAllByPeriodo(this.selectedItemPeriodo).subscribe({
      next: (result) => {
        this.selectedListSemestres = result;
      }
    });

    this.periodoEstudianteService.getAllByPeriodo(this.selectedItemPeriodo).subscribe({
      next: (result) => {
        this.selectedListEstudiante = result;
      }, error: (error) => {

      }
    })
  }

  onSelectChangeMateriaSemestre(event: any) {
    this.construirFormulario();
    this.materiaSemestreService.getAllByPeriodoSemestre(this.selectedItemSemestre).subscribe({
      next: (result) => {
        this.selectListMaterias = result;
        this.filterMateriasByType()
        if (this.selectListMaterias.length === 0)
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            null,
            `No se encontraron ${this.tipoMateriaLabel}s para el semestre seleccionado`)
      },
    });
  }

  onSelectChangeMateriaParalelo(event: any) {
    this.construirFormulario();
    this.proMateriaParaleloService.getAllByCodSemestreMateria(this.selectedItemMateria.codMateriaSemestre).subscribe({
      next: (result) => {
        this.selectedListParalelos = result;
        if (this.selectedListParalelos.length === 0)
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            null,
            `No se encontraron Paralelos para ${this.isMateria ? 'la' : 'el'} ${this.tipoMateriaLabel} ${this.selectedItemMateria.nombreMateria}`)
      }
    });
  }

  onSelectChangeMateriaParaleloEstudiante(event: any) {
    this.construirFormulario();
    this.proParaleloEstudianteService.getAllByCodMateriaParalelo(this.selectedItemParalelo).subscribe({
      next: (result) => {
        this.listadoAsignacion = result;
      }
    });
  }

  changeType(event: MdbTabChange): void {
    this.shouldRender = false;
    setTimeout(() => {
      this.shouldRender = true;
    }, 100)
    this.selectedItemSemestre = null;
    this.selectedItemMateria = null;
    this.estaAgregandoItem = false;
    this.selectedItemPeriodo = null;
    this.listadoAsignacion = undefined;
    this.selectedItemParalelo = null;
    this.tipoMateriaLabel = event.index === 0 ? TipoMateria.Materia : TipoMateria.Proyecto;
  }

  private filterMateriasByType() {
    this.selectListMaterias = this.selectListMaterias.filter(el => this.isMateria ? !el.esProyecto : el.esProyecto)
  }

}
