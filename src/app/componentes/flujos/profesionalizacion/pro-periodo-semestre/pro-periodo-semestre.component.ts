import {Component, OnInit} from '@angular/core';
import {Semestre} from "../../../../modelo/admin/semestre";
import {ProSemestreService} from "../../../../servicios/profesionalizacion/pro-semestre.service";
import {ProPeriodo} from "../../../../modelo/admin/profesionalizacion/pro-periodo";
import {ProPeriodoService} from "../../../../servicios/profesionalizacion/pro-periodo.service";
import {
  defaultPeriodoSemestre, ProPeriodoSemestreCreateUpdateDto,
  ProPeriodoSemestreDto
} from "../../../../modelo/flujos/profesionalizacion/pro-periodo-semestre.models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProPeriodoSemestreService} from "../../../../servicios/profesionalizacion/pro-periodo-semestre.service";
import {ComponenteBase} from "../../../../util/componente-base";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {Notificacion} from "../../../../util/notificacion";

@Component({
  selector: 'app-pro-periodo-semestre',
  templateUrl: './pro-periodo-semestre.component.html',
  styleUrls: ['./pro-periodo-semestre.component.scss']
})
export class ProPeriodoSemestreComponent extends ComponenteBase implements OnInit {
  selectedItem: ProPeriodoSemestreDto;
  selectListSemestres: Semestre[];
  seletedItemPeriodo: number;
  selectedListPeriodos: ProPeriodo[];
  listadoAsignacion: ProPeriodoSemestreDto[];
  headers: { key: string, label: string }[];
  formGroup: FormGroup;
  codigoItemEditando: number;
  estaEditandoItem: boolean;
  estaAgregandoItem: boolean;

  protected readonly defaultItem = defaultPeriodoSemestre;


  constructor(private semestreService: ProSemestreService,
              private periododService: ProPeriodoService,
              private periodoSemestreService: ProPeriodoSemestreService,
              private notificationServiceLocal: MdbNotificationService,
              private popconfirmServiceLocal: MdbPopconfirmService,
              private builder: FormBuilder) {

    super(notificationServiceLocal, popconfirmServiceLocal);
    this.headers = [
      {key: 'nombrePeriodo', label: 'Cohorte'},
      {key: 'nombreSemestre', label: 'Nivel'},

    ]
    this.listadoAsignacion = [];
    this.selectedItem = defaultPeriodoSemestre;
    this.formGroup = new FormGroup({});
    this.construirFormulario();
  }


  ngOnInit(): void {
    this.periododService.listar().subscribe((response) => {
      this.selectedListPeriodos = response;
    })

    this.semestreService.getSemestre().subscribe((response) => {
      this.selectListSemestres = response;
    })
  }

  onCancelarEdicion() {
    this.selectedItem = defaultPeriodoSemestre;
    this.estaEditandoItem = false;
    this.codigoItemEditando = 0;
    this.estaAgregandoItem = false;
    this.formGroup.reset();
  }

  onEditarRegistroInstructor(item: ProPeriodoSemestreDto) {
    this.estaEditandoItem = true;
    this.selectedItem = item;
    this.codigoItemEditando = item.codPeriodoSemestre;
    this.matchDatosDelegadoEnFormulario();
  }

  onAgregarItem() {
    this.selectedItem = {
      ...this.selectedItem,
      codPeriodo: this.seletedItemPeriodo,
      //nombrePeriodo: this.seletedItemPeriodo.nombrePeriodo
    };
    this.estaAgregandoItem = true;
    this.construirFormulario();
  }

  onGuardarCambios() {
    this.editarItem(this.selectedItem);
    this.construirFormulario();
  }

  private construirFormulario() {
    this.formGroup = this.builder.group({
      codSemestre: ['', Validators.required],
      codPeriodo: [this.seletedItemPeriodo, Validators.required]
    })
  }

  private editarItem(item: ProPeriodoSemestreDto) {
    this.selectedItem = {
      ...this.selectedItem,
      codSemestre: this.codSemestre?.value,
    }
    const itemRequest: ProPeriodoSemestreCreateUpdateDto = {
      codPeriodo: this.seletedItemPeriodo,
      codSemestre: this.codSemestre?.value,
      codPeriodoSemestre: this.selectedItem.codPeriodoSemestre
    }
    const request = itemRequest.codPeriodoSemestre == 0 ? this.periodoSemestreService.crear(itemRequest) : this.periodoSemestreService.actualizar(itemRequest, itemRequest.codPeriodoSemestre);
    request.subscribe({
      next: (value) => {
        this.estaEditandoItem = false;
        this.selectedItem = defaultPeriodoSemestre;
        this.onCancelarEdicion();
        this.periodoSemestreService.getAllByPeriodo(this.seletedItemPeriodo).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          }
        })
        Notificacion.notificacionOK(
          this.notificationRef,
          this.notificationServiceLocal,
          'Asignación actualizada con éxito'
        );
      }
    })
  }
  confirmaEliminarMensaje(){
    this.mensajeConfirmacion = '¿Eliminar el registro? Esta acción es irreversible';
  }
  confirmarEliminar($event: Event, dato: number): void {
    super.confirmaEliminarMensaje();
    this.selectedItem.codPeriodoSemestre= dato;
    super.openPopconfirm(event, this.onEliminarRegistro.bind(this));
  }

  onEliminarRegistro() {
    this.periodoSemestreService.eliminar(this.selectedItem.codPeriodoSemestre  ).subscribe({
      next: (periodoSemestre) => {
        this.formGroup.reset();
        this.periodoSemestreService.getAllByPeriodo(this.seletedItemPeriodo).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          }
        })
      }
    });
  }

  get codSemestre() {
    return this.formGroup.get('codSemestre');
  }

  private matchDatosDelegadoEnFormulario() {
    this.formGroup.patchValue({
      codSemestre: this.selectedItem.codSemestre
    })
  }

  onSelectChange(event: any) {
    this.construirFormulario();
    this.periodoSemestreService.getAllByPeriodo(this.seletedItemPeriodo).subscribe({
      next: (result) => {
        this.listadoAsignacion = result;
      }
    });
  }
}
