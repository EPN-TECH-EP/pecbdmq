import {Component, OnInit} from '@angular/core';
import {
  defaultParaleloMateria, ProMateriaParaleloCreateUpdateDto,
  ProMateriaParaleloDto
} from "../../../../modelo/flujos/profesionalizacion/pro-paralelo-materia.models";
import {ProPeriodo} from "../../../../modelo/admin/profesionalizacion/pro-periodo";
import {
  defaultPeriodoSemestre,
  ProPeriodoSemestreDto
} from "../../../../modelo/flujos/profesionalizacion/pro-periodo-semestre.models";
import {ProMateriaSemestreDto} from "../../../../modelo/flujos/profesionalizacion/pro-materia-semestre.models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Materia} from "../../../../modelo/admin/materias";
import {Paralelo} from "../../../../modelo/admin/paralelo";
import {ProPeriodoSemestreService} from "../../../../servicios/profesionalizacion/pro-periodo-semestre.service";
import {ProPeriodoService} from "../../../../servicios/profesionalizacion/pro-periodo.service";
import {ProMateriaSemestreService} from "../../../../servicios/profesionalizacion/pro-materia-semestre.service";
import {ProMateriaParaleloService} from "../../../../servicios/profesionalizacion/pro-paralelo-materia.service";
import {ProMateriaService} from "../../../../servicios/profesionalizacion/pro-materia.service";
import {ProParaleloService} from "../../../../servicios/profesionalizacion/pro-paralelo.service";
import {ProParaleloInstructorService} from "../../../../servicios/profesionalizacion/pro-paralelo-instructor.service";
import {
  defaultParaleloInsructor,
  ProParaleloInsructorCreateUpdateDto,
  ProParaleloInsructorDto
} from "../../../../modelo/flujos/profesionalizacion/pro-paralelo-instructor.modelo";
import {Instructor} from "../../../../modelo/flujos/instructor";
import {ProInstructorService} from "../../../../servicios/profesionalizacion/pro-instructor.service";
import {TipoMateria} from "../../../../enum/materia-type.enum";
import {MdbTabChange} from "mdb-angular-ui-kit/tabs/tabs.component";
import {Notificacion} from "../../../../util/notificacion";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../../../util/alerta/alerta.component";

@Component({
  selector: 'app-pro-paralelo-instructor',
  templateUrl: './pro-paralelo-instructor.component.html',
  styleUrls: ['./pro-paralelo-instructor.component.scss']
})
export class ProParaleloInstructorComponent implements OnInit {
  selectedItem: ProParaleloInsructorDto;

  seletedItemPeriodo: number;
  selectedListPeriodos: ProPeriodo[];
  seletedItemSemestre: number;
  selectedListSemestres: ProPeriodoSemestreDto[];
  selectedListMaterias: ProMateriaSemestreDto[];
  selectedListParalelo: ProMateriaParaleloDto[];
  listadoAsignacion: ProParaleloInsructorDto[];

  headers: { key: string, label: string }[];
  formGroup: FormGroup;
  
  codigoItemEditando: number;
  estaEditandoItem: boolean;
  estaAgregandoItem: boolean;

  protected readonly defaultItem = defaultPeriodoSemestre;
  materiasList: Materia[];
  paralelosList: Paralelo[];
  instructorList: Instructor[];

  defaultMateriaParalelo = defaultParaleloMateria;

  seletedItemInstructor: number;
  seletedItemMateria: ProMateriaSemestreDto;
  seletedItemParalelo: number;
  tipoMateriaLabel: TipoMateria = TipoMateria.Materia;
  public shouldRender = false;

  notificationRef: MdbNotificationRef<AlertaComponent> | null;


  constructor(private periodoSemestreService: ProPeriodoSemestreService, private periododService: ProPeriodoService, private materiaSemestreService: ProMateriaSemestreService, private proMateriaParaleloService: ProMateriaParaleloService, private builder: FormBuilder,
              private materiasService: ProMateriaService, private paraleloService: ProParaleloService, private proParaleloInstructorService: ProParaleloInstructorService, private instructorService: ProInstructorService,
              private notificationServiceLocal: MdbNotificationService) {
    this.headers = [
      {key: 'nombreInstructor', label: 'Instructor'},

    ]
    this.listadoAsignacion = [];
    this.selectedItem = defaultParaleloInsructor;
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

    this.instructorService.listar().subscribe((response) => {
      this.instructorList = response;
    })


  }

  onCancelarEdicion() {
    this.selectedItem = defaultParaleloInsructor;
    this.estaEditandoItem = false;
    this.codigoItemEditando = 0;
    this.estaAgregandoItem = false;
    this.formGroup.reset();
  }

  onEditarRegistroInstructor(item: ProParaleloInsructorDto) {
    this.estaEditandoItem = true;
    this.selectedItem = item;
    this.codigoItemEditando = item.codPeriodoSemestreMateriaParaleloInstructor;
    this.matchDatosItemEnFormulario();
  }

  onAgregarItem() {
    this.selectedItem = {
      ...this.selectedItem,
      codPeriodoSemestreMateriaParalelo: this.seletedItemParalelo,
    };
    this.estaAgregandoItem = true;

  }


  onGuardarCambios() {
    this.editarItem(this.selectedItem);
  }


  private construirFormulario() {
    this.formGroup = this.builder.group({
      codInstructor: ['', Validators.required],
      codPeriodoEstudianteSemestreMateriaParalelo: [this.selectedListParalelo, Validators.required],

    })
  }

  private editarItem(item: ProParaleloInsructorDto) {
    this.selectedItem = {
      ...this.selectedItem,
      codInstructor: this.codInstructor?.value,
    }
    const itemRequest: ProParaleloInsructorCreateUpdateDto = {
      codInstructor: this.codInstructor?.value,
      codPeriodoSemestreMateriaParaleloInstructor: this.selectedItem.codPeriodoSemestreMateriaParaleloInstructor,
      codPeriodoSemestreMateriaParalelo: this.seletedItemParalelo

    }
    const request = itemRequest.codPeriodoSemestreMateriaParaleloInstructor == 0 ? this.proParaleloInstructorService.crear(itemRequest) : this.proParaleloInstructorService.actualizar(itemRequest, itemRequest.codPeriodoSemestreMateriaParaleloInstructor);
    request.subscribe({
      next: (value) => {
        this.estaEditandoItem = false;
        this.selectedItem = defaultParaleloInsructor;
        this.onCancelarEdicion();
        this.proParaleloInstructorService.getAllByCodMateriaParalelo(this.seletedItemParalelo).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          }
        })
      }
    })
  }

  onEliminarRegistro(dato: ProParaleloInsructorDto) {
    this.proParaleloInstructorService.eliminar(dato.codPeriodoSemestreMateriaParaleloInstructor).subscribe({
      next: (instructor) => {
        this.formGroup.reset();
        this.proParaleloInstructorService.getAllByCodMateriaParalelo(dato.codPeriodoSemestreMateriaParaleloInstructor).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          }
        })
      }
    });
  }

  get codInstructor() {
    return this.formGroup.get('codInstructor');
  }

  private matchDatosItemEnFormulario() {
    this.formGroup.patchValue({
      codInstructor: this.selectedItem.codInstructor,
      codPeriodoSemestreMateriaParaleloInstructor: this.selectedItem.codPeriodoSemestreMateriaParaleloInstructor,
      codPeriodoEstudianteSemestreMateriaParalelo: this.selectedItem.codPeriodoSemestreMateriaParalelo
    })
  }

  onSelectChange(event: any) {

    this.periodoSemestreService.getAllByPeriodo(this.seletedItemPeriodo).subscribe({
      next: (result) => {
        this.selectedListSemestres = result;
      }
    });
  }

  onSelectChangeMateriaSemestre(event: any) {
    this.construirFormulario();
    this.materiaSemestreService.getAllByPeriodoSemestre(this.seletedItemSemestre).subscribe({
      next: (result) => {
        this.selectedListMaterias = result;
        this.filterMateriasByType();
        if (this.selectedListMaterias.length === 0)
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            null,
            `No se encontraron ${this.tipoMateriaLabel}s para el semestre seleccionado`)
      }
    });
  }

  private filterMateriasByType() {
    this.selectedListMaterias = this.selectedListMaterias.filter(el => this.isMateria ? !el.esProyecto : el.esProyecto)
  }

  onSelectChangeMateriaParalelo(event: any) {
    this.construirFormulario();
    this.proMateriaParaleloService.getAllByCodSemestreMateria(this.seletedItemMateria.codMateriaSemestre).subscribe({
      next: (result) => {
        this.selectedListParalelo = result;
      }
    });
  }

  onSelectChangeParaleloInstructor(event: any) {
    this.construirFormulario();
    this.proParaleloInstructorService.getAllByCodMateriaParalelo(this.seletedItemParalelo).subscribe({
      next: (result) => {
        this.listadoAsignacion = result;
        this.shouldRender = true;
      }
    });
  }

  public get isMateria(): boolean {
    return this.tipoMateriaLabel === 'Materia';
  }

  changeType(event: MdbTabChange): void {
    this.shouldRender = false;
    setTimeout(() => {
      this.shouldRender = true;
    }, 100)
    this.seletedItemSemestre = null;
    this.seletedItemMateria = null;
    this.estaAgregandoItem = false;
    this.seletedItemPeriodo = null;
    this.listadoAsignacion = [];
    this.seletedItemParalelo = null;
    this.tipoMateriaLabel = event.index === 0 ? TipoMateria.Materia : TipoMateria.Proyecto;
  }


  protected readonly defaultParaleloInsructor = defaultParaleloInsructor;

}
