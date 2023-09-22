import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from "mdb-angular-ui-kit/modal";
import {
  ModalSansionComponent
} from "../../../flujos/formacion/formacion-academica/modal-sansion/modal-sansion.component";
import { NotaDisciplina } from "../../../../modelo/flujos/Estudiante";
import { FaltaPeriodo } from "../../../../modelo/flujos/formacion/api-bomberos/faltaPeriodo";
import { EstudianteService, FaltaEstudiante } from "../../../../servicios/formacion/estudiante.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TipoFaltaService } from "../../../../servicios/tipo-falta.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { InstructorService } from "../../../../servicios/formacion/instructor.service";
import { AutenticacionService } from "../../../../servicios/autenticacion.service";
import { forkJoin, switchMap } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { Notificacion } from "../../../../util/notificacion";

@Component({
  selector: 'app-modal-llamamiento-sancion',
  templateUrl: './modal-llamamiento-sancion.component.html',
  styleUrls: ['./modal-llamamiento-sancion.component.scss']
})
export class ModalLlamamientoSancionComponent implements OnInit {

  estudiante: NotaDisciplina;
  faltas: FaltaPeriodo[];
  documentoFalta: File;
  faltasPorEstudiante: FaltaEstudiante[];
  sancionForm: FormGroup;
  estaCreandoFalta: boolean;
  headers: {key: string, label: string}[];
  esInstructor: boolean;

  constructor(
    public modalRef: MdbModalRef<ModalLlamamientoSancionComponent>,
    private faltaService: TipoFaltaService,
    private builder: FormBuilder,
    private estudianteService: EstudianteService,
    private ns: MdbNotificationService,
    private instructorService: InstructorService,
    private authService: AutenticacionService,
  ) {
    this.headers = [
      { key: 'sancion', label: 'Fecha Sanción' },
      { key: 'sancion', label: 'Falta' },
      { key: 'nombre', label: 'Observaciones' },
    ];
    this.estaCreandoFalta = false;
    this.esInstructor = false;
    this.estudiante = null;
    this.faltas = [];
    this.faltasPorEstudiante = [];
    this.sancionForm = new FormGroup({});
    this.documentoFalta = null;
    this.construirFormulario();
  }

  ngOnInit(): void {

    this.faltaService.listarTipoFaltaPeriodo().subscribe({
      next: (data) => {
        this.faltas = data;
      }
    })

  }

  private construirFormulario() {
    this.sancionForm = this.builder.group({
      codFaltaPeriodo: ['', Validators.required],
      observacionSancion: ['', Validators.required],
      archivo: ['', Validators.required],
    });

    this.sancionForm.valueChanges.subscribe({
      next: (data) => {
        console.log(data);
      }
    });
  }

  private mostrarNotificacion(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
  }

  private guardarFalta(formData: FormData) {
    this.sancionForm.reset()
    this.modalRef.close();

  }

  onFileChange($event: Event) {
    const target = $event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.documentoFalta = files[0];
  }

  onGuardarFalta() {
    if (this.sancionForm.invalid) {
      this.mostrarNotificacion('Formulario inválido', TipoAlerta.ALERTA_ERROR);
      return;
    }
    this.estaCreandoFalta = true;
    const formData = new FormData();

    this.mostrarNotificacion('Falta creada correctamente', TipoAlerta.ALERTA_OK);
    this.guardarFalta(formData);

  }
}
