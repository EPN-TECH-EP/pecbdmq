import { Component, OnInit } from '@angular/core';
import { CapacitacionExternaService } from "../capacitacion-externa.service";
import { MdbTabChange } from "mdb-angular-ui-kit/tabs/tabs.component";
import { Instructor } from "../../../../modelo/flujos/instructor";
import { InstructorService } from "../../../../servicios/formacion/instructor.service";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { Requisito } from "../../../../modelo/admin/requisito";
import { RequisitoService } from "../../../../servicios/requisito.service";

@Component({
  selector: 'app-flujo-capacitacion',
  templateUrl: './flujo-capacitacion.component.html',
  styleUrls: ['./flujo-capacitacion.component.scss']
})
export class FlujoCapacitacionComponent implements OnInit {

  items: {
    instructor?: Instructor;
    status?: string;
    type: string;
    subItems: string[]
    instructorElegido?: boolean;
  }[];
  instructores: Instructor[] = [];
  requisitosCurso: Requisito[];
  requisitosCursoSeleccionados: Requisito[] = [];


  constructor(
    private capacitacionExternaservice: CapacitacionExternaService,
    private insturctoresService: InstructorService,
    private ns: MdbNotificationService,
    private servicioRequisito: RequisitoService
  ) { }

  ngOnInit(): void {
    this.capacitacionExternaservice.obtenerDelLocalStorage()
    this.items = this.capacitacionExternaservice.items;
    this.escucharItemsSolicitud();
    this.insturctoresService.listar().subscribe({
      next: instructores => {
        this.instructores = instructores;
      }
    });
    this.servicioRequisito.getRequisito().subscribe({
      next: (requisitos) => {
        this.requisitosCurso= requisitos;
      }
    });
  }


  escucharItemsSolicitud() {
    this.capacitacionExternaservice.itemsSolicitud$.subscribe(
      items => {
        if (items) {
          this.items = items;
        }
      }
    )
  }

  change($event: MdbTabChange) {
    if ($event.index === 0) {
      this.capacitacionExternaservice.obtenerDelLocalStorage()
    }
    if ($event.index === 1) {
      this.capacitacionExternaservice.obtenerDelLocalStorage()
    }

  }


  solicitarInstructor(int: Instructor) {
    Notificacion.notificar(this.ns,`Solicitud enviada a ${int.nombre} ${int.apellido}`,TipoAlerta.ALERTA_OK)
  }

  realizarSolicitud(item: {
    instructor?: Instructor;
    status?: string;
    type: string;
    subItems: string[];
    instructorElegido?: boolean
  }) {
    Notificacion.notificar(this.ns,`Solicitud de requerimientos realizada con exito`,TipoAlerta.ALERTA_OK)

  }

  toggleSubItem(subItem: any) {

    // buscamos si esl subitem ya esta en el arreglo
    const index = this.requisitosCursoSeleccionados.findIndex(
      (requisito) => requisito.codigoRequisito === subItem.codigoRequisito
    );
    if (index === -1) {
      this.requisitosCursoSeleccionados.push(subItem);
    }
    else {
      this.requisitosCursoSeleccionados.splice(index, 1);
    }
  }

  aprobarCurso() {
    Notificacion.notificar(this.ns,`Curso aprobado con exito`,TipoAlerta.ALERTA_OK)
  }

  generarCertificados() {
    Notificacion.notificar(this.ns,`Certificados generados con exito`,TipoAlerta.ALERTA_OK)
  }
}
