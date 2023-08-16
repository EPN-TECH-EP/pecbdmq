import {Component, OnInit} from '@angular/core';
import {ProInscripcionDelegadoService} from "../../../../servicios/profesionalizacion/pro-inscripcion-delegado.service";
import {AutenticacionService} from "../../../../servicios/autenticacion.service";
import {Usuario} from "../../../../modelo/admin/usuario";
import {ProConvocatoriaService} from "../../../../servicios/profesionalizacion/pro-convocatoria.service";
import {ProConvocatoria} from "../../../../modelo/admin/pro-convocatoria";
import {ProInscripcionDelegadoDto} from "../../../../modelo/flujos/profesionalizacion/pro-inscripcion-delegado.dto";
import {FormGroup} from "@angular/forms";
import {defaultInstructor} from "../../../../modelo/flujos/instructor";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {ProValidacionRequisitosComponent} from "../pro-validacion-requisitos/pro-validacion-requisitos.component";
import {ProCumpleRequisitosService} from "../../../../servicios/profesionalizacion/pro-cumple-requisitos.service";

@Component({
  selector: 'app-pro-listado-inscripcion-delegado',
  templateUrl: './pro-listado-inscripcion-delegado.component.html',
  styleUrls: ['./pro-listado-inscripcion-delegado.component.scss']
})
export class ProListadoInscripcionDelegadoComponent implements OnInit {
  public userData: Usuario;
  public listadoConvocatoria: ProConvocatoria[];
  public selectedItemConvocatoria: ProConvocatoria;
  public listadoAsignacion: ProInscripcionDelegadoDto[];
  public headers: { key: string, label: string }[];
  public estaAgregandoItem: boolean;
  public existenCoincidencias: boolean;
  public estaValidandoRequisitos: MdbModalRef<ProValidacionRequisitosComponent>;
  formGroup: FormGroup;

  constructor(
    private inscripcionDelegadoService: ProInscripcionDelegadoService,
    private autenticacionService: AutenticacionService,
    private proConvocatoriaService: ProConvocatoriaService,
    private modalService: MdbModalService,
    private cumpleRequisitosService: ProCumpleRequisitosService
  ) {
    this.userData = this.autenticacionService.obtieneUsuarioDeCache()
    console.log(this.userData)
    this.headers = [
      {key: 'cedula', label: 'Cedula'},
      {key: 'nombre', label: 'Nombre'}
    ]
  }

  ngOnInit(): void {
    this.proConvocatoriaService.listar().subscribe({
      next: (result) => {
        this.listadoConvocatoria = result;
      }
    })
  }

  onSelectChange(event: any) {
    this.inscripcionDelegadoService.listByDatosConvocatoria(this.selectedItemConvocatoria.codigo, this.userData.codDatosPersonales.codDatosPersonales).subscribe({
      next: (result) => {
        this.listadoAsignacion = result;
      }
    })
  }

  /* private cargarListado() {
     this.inscripcionDelegadoService.listByDatosConvocatoria()

     )
   }*/

  protected readonly defaultInstructor = defaultInstructor;

  abrirModalValidarRequisitos(asignacion: ProInscripcionDelegadoDto) {
    this.cumpleRequisitosService.idPostulante = asignacion.codInscripciones;
    this.estaValidandoRequisitos = this.modalService.open(ProValidacionRequisitosComponent, {
      data: {codInscripcion: asignacion.codInscripciones},
      modalClass: 'modal-xl modal-dialog-centered',

    });

    this.estaValidandoRequisitos.onClose.subscribe((message: any) => {
      this.estaValidandoRequisitos = null;
      this.inscripcionDelegadoService.listByDatosConvocatoria(this.selectedItemConvocatoria.codigo, this.userData.codDatosPersonales.codDatosPersonales).subscribe({
        next: (result) => {
          this.listadoAsignacion = result;
        }
      })
    });


  }
}
