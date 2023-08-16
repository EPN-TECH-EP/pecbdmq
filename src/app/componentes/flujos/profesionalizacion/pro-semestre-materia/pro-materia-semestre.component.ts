import {Component, OnInit} from '@angular/core';
import {
  defaultPeriodoSemestre,
  ProPeriodoSemestreDto
} from "../../../../modelo/flujos/profesionalizacion/pro-periodo-semestre.models";
import {Semestre} from "../../../../modelo/admin/semestre";
import {ProPeriodo} from "../../../../modelo/admin/profesionalizacion/pro-periodo";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProPeriodoService} from "../../../../servicios/profesionalizacion/pro-periodo.service";
import {ProPeriodoSemestreService} from "../../../../servicios/profesionalizacion/pro-periodo-semestre.service";
import {
  defaultMateriaSemestre, ProMateriaSemestreCreateUpdateDto,
  ProMateriaSemestreDto
} from "../../../../modelo/flujos/profesionalizacion/pro-materia-semestre.models";
import {ProMateriaSemestreService} from "../../../../servicios/profesionalizacion/pro-materia-semestre.service";
import {ProMateriaService} from "../../../../servicios/profesionalizacion/pro-materia.service";
import {AulaService} from "../../../../servicios/aula.service";
import {Materia} from "../../../../modelo/admin/materias";
import {Aula} from "../../../../modelo/admin/aula";
import {Notificacion} from "../../../../util/notificacion";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../../../util/alerta/alerta.component";

@Component({
  selector: 'app-pro-materia-semestre',
  templateUrl: './pro-materia-semestre.component.html',
  styleUrls: ['./pro-materia-semestre.component.scss']
})
export class ProMateriaSemestreComponent implements OnInit {

  selectedItem: ProMateriaSemestreDto;
  selectListSemestres: Semestre[];

  seletedItemPeriodo: number;
  selectedListPeriodos: ProPeriodo[];
  seletedItemSemestre: number;
  selectedListSemestres: ProPeriodoSemestreDto[];
  listadoAsignacion: ProMateriaSemestreDto[];
  listadoAsignacionPeriodoSemestre: ProPeriodoSemestreDto[];
  headers: { key: string, label: string }[];
  formGroup: FormGroup;
  codigoItemEditando: number;
  estaEditandoItem: boolean;
  estaAgregandoItem: boolean;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  protected readonly defaultItem = defaultPeriodoSemestre;
  materiasList: Materia[];
  aulaList: Aula[];

  defaultMateriaSemestre = defaultMateriaSemestre;

  constructor(private periodoSemestreService: ProPeriodoSemestreService, private periododService: ProPeriodoService, private materiaSemestreService: ProMateriaSemestreService, private builder: FormBuilder,
              private materiasService: ProMateriaService, private aulaService: AulaService, private notificationServiceLocal: MdbNotificationService) {
    this.headers = [
      {key: 'nombrePeriodo', label: 'Cohorte'},
      {key: 'nombreSemestre', label: 'Nivel'},
      {key: 'nombreMateria', label: 'Materia'},
      {key: 'nombreAula', label: 'Aula'},
      {key: 'numeroHoras', label: 'Número Horas'},
      {key: 'notaMinima', label: 'Nota Mínima'},
      {key: 'notaMaxima', label: 'Nota Máxima'},
      {key: 'esProyecto', label: 'Es Proyecto?'},

    ]
    this.listadoAsignacion = [];
    this.selectedItem = defaultMateriaSemestre;
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

    this.aulaService.listar().subscribe((response) => {
      this.aulaList = response;
    })

  }

  onCancelarEdicion() {
    this.selectedItem = defaultMateriaSemestre;
    this.estaEditandoItem = false;
    this.codigoItemEditando = 0;
    this.estaAgregandoItem = false;
    this.formGroup.reset();
    this.construirFormulario();
  }

  onEditarRegistroInstructor(item: ProMateriaSemestreDto) {
    this.estaEditandoItem = true;
    this.selectedItem = item;
    this.codigoItemEditando = item.codMateriaSemestre;
    this.matchDatosItemEnFormulario();
  }

  onAgregarItem() {
    this.selectedItem = {
      ...this.selectedItem,
      codPeriodoSemestre: this.seletedItemSemestre,
    };
    this.estaAgregandoItem = true;
    this.construirFormulario();
  }

  onGuardarCambios() {
    this.editarItem(this.selectedItem);
  }

  private construirFormulario() {
    this.formGroup = this.builder.group({
      codMateria: ['', Validators.required],
      codPeriodoSemestre: [this.seletedItemSemestre, Validators.required],
      codAula: ['', Validators.required],
      numeroHoras: ['', Validators.required],
      notaMinima: ['', Validators.required],
      notaMaxima: ['', Validators.required],
    })
  }

  private editarItem(item: ProMateriaSemestreDto) {
    this.selectedItem = {
      ...this.selectedItem,
      codMateria: this.codMateria?.value,
      codAula: this.codAula?.value,
      numeroHoras: this.numeroHoras?.value,
      notaMinima: this.notaMinima?.value,
      notaMaxima: this.notaMaxima?.value
    }
    const itemRequest: ProMateriaSemestreCreateUpdateDto = {
      codMateria: this.codMateria?.value,
      codMateriaSemestre: this.selectedItem.codMateriaSemestre,
      codPeriodoSemestre: this.seletedItemSemestre,
      codAula: this.codAula?.value,
      numeroHoras: this.numeroHoras?.value,
      notaMinima: this.notaMinima?.value,
      notaMaxima: this.notaMaxima?.value
    }
    const request = itemRequest.codMateriaSemestre === 0 ?
      this.materiaSemestreService.crear(itemRequest) : this.materiaSemestreService.actualizar(itemRequest, itemRequest.codMateriaSemestre);
    request.subscribe({
      next: (value) => {
        this.estaEditandoItem = false;
        this.selectedItem = defaultMateriaSemestre;
        this.onCancelarEdicion();
        this.materiaSemestreService.getAllByPeriodoSemestre(this.seletedItemSemestre).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          }
        })

        Notificacion.notificacionOK(
          this.notificationRef,
          this.notificationServiceLocal,
          'Asignacion realizada con éxito'
        );
      }
    })
  }

  onEliminarRegistro(dato: ProMateriaSemestreDto) {
    this.materiaSemestreService.eliminar(dato.codMateriaSemestre).subscribe({
      next: (instructor) => {
        this.formGroup.reset();
        this.materiaSemestreService.getAllByPeriodoSemestre(this.seletedItemSemestre).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          }
        })
      }
    });
  }

  get codMateria() {
    return this.formGroup.get('codMateria');
  }

  get codAula() {
    return this.formGroup.get('codAula');
  }

  get numeroHoras() {
    return this.formGroup.get('numeroHoras');
  }

  get notaMinima() {
    return this.formGroup.get('notaMinima');
  }

  get notaMaxima() {
    return this.formGroup.get('notaMaxima');
  }

  private matchDatosItemEnFormulario() {
    this.formGroup.patchValue({
      codMateria: this.selectedItem.codMateria,
      codMateriaSemestre: this.selectedItem.codMateriaSemestre,
      codPeriodoSemestre: this.selectedItem.codPeriodoSemestre,
      codAula: this.selectedItem.codAula,
      numeroHoras: this.selectedItem.numeroHoras,
      notaMinima: this.selectedItem.notaMinima,
      notaMaxima: this.selectedItem.notaMaxima
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
        this.listadoAsignacion = result;
      }
    });
  }

}
