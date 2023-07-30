import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from "mdb-angular-ui-kit/modal";
import {
  ModalSansionComponent
} from "../../flujos/formacion/formacion-academica/modal-sansion/modal-sansion.component";
import { NotaMateriaPorEstudiante } from "../../../servicios/formacion/estudiante.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ApelacionRequest,
  ApelacionesService,
} from "../../../servicios/formacion/apelaciones.service";
import { Notificacion } from "../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../enum/tipo-alerta";
import { Estudiante } from "../../../modelo/flujos/Estudiante";

@Component({
  selector: 'app-modal-apelacion',
  templateUrl: './modal-apelacion.component.html',
  styleUrls: ['./modal-apelacion.component.scss']
})
export class ModalApelacionComponent implements OnInit {

  estudiante: Estudiante;
  nota: NotaMateriaPorEstudiante;
  apelacionForm: FormGroup;
  headers: { key: string, label: string }[];

  constructor(
    public modalRef: MdbModalRef<ModalSansionComponent>,
    private builder: FormBuilder,
    private apelacionService: ApelacionesService,
    private ns : MdbNotificationService
  ) {
    this.estudiante = null;
    this.nota = null;
    this.apelacionForm = new FormGroup({});
    this.headers = [
      { key: 'fecha', label: 'Fecha' },
      { key: 'observacionEstudiante', label: 'Observación' },
      { key: 'estado', label: 'Estado' },
    ];
    this.construirFormulario();
  }

  ngOnInit(): void {

  }

  private construirFormulario() {
    this.apelacionForm = this.builder.group({
      observacionEstudiante: ['', Validators.required],
    });

  }

  private guardarApelacion(apelacion: ApelacionRequest) {
    this.apelacionService.crear(apelacion).subscribe({
      next: () => {
        this.modalRef.close();
        Notificacion.notificar(this.ns, 'Apelación creada con éxito', TipoAlerta.ALERTA_OK)
      },
      error: (err) => {
        console.error(err);
        Notificacion.notificar(this.ns, err.error.mensaje, TipoAlerta.ALERTA_ERROR)
      }
    })
  }

  crearApelacion() {
    const apelacion: ApelacionRequest = {
      codNotaFormacion: this.nota.codNotaFormacion,
      observacionEstudiante: this.apelacionForm.get('observacionEstudiante')?.value,
    }

    this.guardarApelacion(apelacion);
  }
}
