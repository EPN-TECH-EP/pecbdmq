import { Component, OnInit } from '@angular/core';
import { Paralelo } from "../../../../../modelo/admin/paralelo";
import { NotaDisciplina } from "../../../../../modelo/flujos/Estudiante";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RegistroNotasService } from "../../../../../servicios/formacion/registro-notas.service";
import { Notificacion } from "../../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { MdbModalRef, MdbModalService } from "mdb-angular-ui-kit/modal";
import { ModalSansionComponent } from "../modal-sansion/modal-sansion.component";

@Component({
  selector: 'app-registro-notas-disciplinarias',
  templateUrl: './registro-notas-disciplinarias.component.html',
  styleUrls: ['./registro-notas-disciplinarias.component.scss']
})
export class RegistroNotasDisciplinariasComponent implements OnInit {

  estudiantesPorParalelo: {paralelo: Paralelo, estudiantes: NotaDisciplina[]}[]
  notaPorEstudianteForm: FormGroup;
  headers: {key: string, label: string}[];

  estaEditandoNota: boolean;
  estudianteNotaEditando: NotaDisciplina;
  codEstudianteNotaEditando: number;

  modalRef: MdbModalRef<ModalSansionComponent> | null = null;


  constructor(
    private builder: FormBuilder,
    private registroNotasService: RegistroNotasService,
    private ns: MdbNotificationService,
    private modalService: MdbModalService
  ) {
    this.headers = [
      { key: 'nombre', label: 'Código único' },
      { key: 'nombre', label: 'Estudiante' },
      { key: 'notaDisciplinaria', label: 'Nota Final Disciplinaria' },
    ];
    this.estaEditandoNota = false;
    this.estudiantesPorParalelo = [];
    this.estudianteNotaEditando = null;
    this.notaPorEstudianteForm = new FormGroup({});
    this.construirFormulario();

  }

  ngOnInit(): void {
    this.registroNotasService.listarEstudiantesNotaDisciplina().subscribe({
      next: (data) => {
        const paralelos = data.paralelos;
        this.estudiantesPorParalelo = paralelos.map(paralelo => {
          const estudiantes = data.estudiantesNotaDisciplina.filter(estudiante =>
            estudiante.codParalelo === paralelo.codParalelo);
          return { paralelo, estudiantes };
        });

      }
    })
  }

  private construirFormulario() {
    this.notaPorEstudianteForm = this.builder.group({
      codNota: [''],
      notaDisciplina: [''],
    });
    this.notaPorEstudianteForm.valueChanges.subscribe({
      next: (data) => {
        console.log(data);
      }
    });
  }

  editarNota(estudiante: NotaDisciplina) {
    this.estaEditandoNota = true;
    this.codEstudianteNotaEditando = estudiante.codEstudiante;
    this.estudianteNotaEditando = estudiante;
    this.notaPorEstudianteForm.patchValue({
      codNota: estudiante.codEstudiante,
      notaDisciplina: estudiante.promedioDisciplinaOficialSemana,
    });
  }

  onCancelarEdicionNota() {
    this.estaEditandoNota = false;
    this.codEstudianteNotaEditando = 0;
    this.estudianteNotaEditando = null;
  }

  onGuardarEdicionNota() {
    const notaDisciplinaPorEstudiante: NotaDisciplina = {
      codEstudiante: this.notaPorEstudianteForm.get('codNota')?.value,
      promedioDisciplinaOficialSemana: this.notaPorEstudianteForm.get('notaDisciplina')?.value,
      cedula: this.estudianteNotaEditando.cedula,
      codUnico: this.estudianteNotaEditando.codUnico,
      nombreCompleto: this.estudianteNotaEditando.nombreCompleto,
      codParalelo: this.estudianteNotaEditando.codParalelo,
    }

    this.registroNotasService.registrarNotaOficialSemana(
      [{
        codEstudiante: notaDisciplinaPorEstudiante.codEstudiante,
        promedioDisciplinaOficialSemana: notaDisciplinaPorEstudiante.promedioDisciplinaOficialSemana,
      }]
    ).subscribe({
      next: () => {
        Notificacion.notificar(this.ns, 'Nota disciplinaria registrada', TipoAlerta.ALERTA_OK);

        const indexParalelo = this.estudiantesPorParalelo.findIndex(paralelo => paralelo.paralelo.codParalelo === notaDisciplinaPorEstudiante.codParalelo);
        const indexEstudiante = this.estudiantesPorParalelo[indexParalelo].estudiantes.findIndex(estudiante => estudiante.codEstudiante === notaDisciplinaPorEstudiante.codEstudiante);
        this.estudiantesPorParalelo[indexParalelo].estudiantes[indexEstudiante].promedioDisciplinaOficialSemana = notaDisciplinaPorEstudiante.promedioDisciplinaOficialSemana;
        this.estudiantesPorParalelo[indexParalelo].estudiantes = [...this.estudiantesPorParalelo[indexParalelo].estudiantes];

        this.onCancelarEdicionNota();
      },
      error: (error) => {
        console.log(error);
        this.onCancelarEdicionNota();
      }

    });
  }

  onVerSanciones(estudiante: NotaDisciplina) {
    this.modalRef = this.modalService.open(ModalSansionComponent, {
        data: { estudiante: estudiante },
        modalClass: 'modal-lg modal-dialog-centered',
    });

  }
}
