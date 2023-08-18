import {Component, OnInit} from '@angular/core';
import {ProPeriodo} from "../../../../modelo/admin/profesionalizacion/pro-periodo";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProPeriodoService} from "../../../../servicios/profesionalizacion/pro-periodo.service";
import {
  defaultPeriodoEstudiante, ProPeriodoEstudianteCreateUpdateDto,
  ProPeriodoEstudianteDto
} from "../../../../modelo/flujos/profesionalizacion/pro-periodo-estudiante.models";
import {DatoPersonalService} from "../../../../servicios/dato-personal.service";
import {DatoPersonal} from "../../../../modelo/admin/dato-personal";
import {ProPeriodoEstudianteService} from "../../../../servicios/profesionalizacion/pro-periodo-estudiante.service";
import {UsuarioDatoPersonalDto} from "../../../../modelo/flujos/profesionalizacion/usuario-dato-personal.models";
import {Notificacion} from "../../../../util/notificacion";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../../../util/alerta/alerta.component";

@Component({
  selector: 'app-pro-periodo-estudiante',
  templateUrl: './pro-periodo-estudiante.component.html',
  styleUrls: ['./pro-periodo-estudiante.component.scss']
})
export class ProPeriodoEstudianteComponent implements OnInit {
  selectedItem: ProPeriodoEstudianteDto;
  selectListPeriodos: ProPeriodo[];
  selectedItemPeriodo: number;
  selectItemDatoPersonal: number;
  selectListDatosPersonales: DatoPersonal[];
  listadoAsignacion: ProPeriodoEstudianteDto[];
  headers: { key: string, label: string }[];
  formGroup: FormGroup;
  codigoItemEditando: number;
  estadoEditandoItem: boolean;
  estaAgregandoItem: boolean;
  protected readonly defaultItem = defaultPeriodoEstudiante;
  existenCoincidencias: boolean;
  usuarios: UsuarioDatoPersonalDto[];
  estaBuscandoUsuarios: boolean;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  constructor(private periodoService: ProPeriodoService, private datosPersonalesService: DatoPersonalService, public periodoEstudianteService: ProPeriodoEstudianteService, private builder: FormBuilder,
              private notificationServiceLocal: MdbNotificationService) {
    this.headers = [
      {key: 'cedula', label: 'Cedula'},
      {key: 'nombre', label: 'Estudiante'},
    ]
    this.listadoAsignacion = [];
    this.selectedItem = defaultPeriodoEstudiante;
    this.formGroup = new FormGroup({});
    this.construirFormulario();
    this.usuarios = [];
  }

  ngOnInit(): void {
    this.periodoService.listar().subscribe((response) => {
      this.selectListPeriodos = response;
    })

  }

  onCancelarEdicion() {
    this.selectedItem = defaultPeriodoEstudiante;
    this.estadoEditandoItem = false;
    this.codigoItemEditando = 0;
    this.estaAgregandoItem = false;
    this.formGroup.reset();
  }

  OnEditarRegistroEstudiante(item: ProPeriodoEstudianteDto) {
    this.estadoEditandoItem = true;
    this.selectedItem = item;
    this.codigoItemEditando = item.codPeriodoEstudiante;
    this.matchDatosDelegadoEnFormulario();
  }

  onAgregarItem(usuario: UsuarioDatoPersonalDto) {
    this.selectedItem = {
      ...this.selectedItem,
      codDatosPersonales: usuario.codDatosPersonales,
      cedula: usuario.nombreUsuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correoPersonal: usuario.correoPersonal,
      codPeriodo: this.selectedItemPeriodo,
      codEstudiante: usuario.codUsuario
    };
    this.estaAgregandoItem = true;
    this.estaBuscandoUsuarios = false;
    this.construirFormulario();
  }

  onGuardarCambios() {
    this.editarItem(this.selectedItem);
  }

  private construirFormulario() {
    this.formGroup = this.builder.group({
      codPeriodo: [this.selectedItemPeriodo, Validators.required],
      codDatosPersonales: ['' || this.selectedItem.codDatosPersonales, Validators.required],
      codPeriodoEstudiante: [0 || this.selectedItem.codPeriodoEstudiante]
    })
  }


  private editarItem(selectedItem: ProPeriodoEstudianteDto) {
    this.selectedItem = {
      ...this.selectedItem,

    }
    const itemRequest: ProPeriodoEstudianteCreateUpdateDto = {
      codDatosPersonales: this.selectedItem.codDatosPersonales,
      codPeriodo: this.selectedItemPeriodo,
      codPeriodoEstudiante: this.selectedItem.codPeriodoEstudiante
    }
    const request = itemRequest.codPeriodoEstudiante == 0 ? this.periodoEstudianteService.crear(itemRequest) : this.periodoEstudianteService.actualizar(itemRequest, itemRequest.codPeriodoEstudiante);
    request.subscribe({
      next: (value) => {
        Notificacion.notificacionOK(
          this.notificationRef,
          this.notificationServiceLocal,
          'Estudiante agregado con exito'
        );
        this.estadoEditandoItem = false;
        this.selectedItem = defaultPeriodoEstudiante;
        this.onCancelarEdicion();
        this.periodoEstudianteService.getAllByPeriodo(this.selectedItemPeriodo).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          }
        })
      }, error: (value) => {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          value
        );
      }
    })
  }

  OnEliminarRegistro(dato: ProPeriodoEstudianteDto) {
    this.periodoEstudianteService.eliminar(dato.codPeriodoEstudiante).subscribe({
      next: () => {
        this.formGroup.reset();
        this.periodoEstudianteService.getAllByPeriodo(this.selectedItemPeriodo).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          }
        })
      }
    })
  }

  get codDatosPersonales() {
    return this.formGroup.get('codDatosPersonales');
  }

  private matchDatosDelegadoEnFormulario() {
    this.formGroup.patchValue({})

  }

  onSelectChange(event: any) {
    this.periodoEstudianteService.getAllByPeriodo(this.selectedItemPeriodo).subscribe({
      next: (result) => {
        this.listadoAsignacion = result;
      }
    })
  }

  estudianteEncontrado(usuario: UsuarioDatoPersonalDto) {
    if (!usuario) {
      console.log('no hay usuario');
      this.existenCoincidencias = false;
      this.usuarios = [];
      return;
    } else {
      this.usuarios[0] = usuario;
      this.usuarios.splice(1);
      this.existenCoincidencias = true;
    }
  }

  estudiantesEncontrados(usuarios: UsuarioDatoPersonalDto[]) {
    const temp =[];
    usuarios.forEach(value => {
      if (value.codPeriodo == this.selectedItemPeriodo){
        temp.push(value);
      }
    })
    this.usuarios = temp;
    this.existenCoincidencias = true;
  }

  limpiarResultados() {
    this.usuarios = [];
  }
}
