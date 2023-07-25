import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ComponenteNota, FormacionService } from "../../../../../servicios/formacion/formacion.service";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { Notificacion } from "../../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";

@Component({
  selector: 'app-componente-nota-formacion',
  templateUrl: './componente-nota-formacion.component.html',
  styleUrls: ['./componente-nota-formacion.component.scss']
})
export class ComponenteNotaFormacion implements OnInit {
  totalPonderacion: number;
  componenteNotaForm: FormGroup;
  componenteNotasPeriodoAcademicoActivo: ComponenteNota[];
  showLoading: boolean;
  estaEditando: boolean;
  codComponenteNotaEditando: number;

  constructor(
    private builder: FormBuilder,
    private formacionService: FormacionService,
    private ns: MdbNotificationService,
  ) {
    this.componenteNotaForm = new FormGroup({});
    this.totalPonderacion = 0;
    this.estaEditando = false;
    this.codComponenteNotaEditando = 0;
    this.showLoading = false;
    this.componenteNotasPeriodoAcademicoActivo = []
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.formacionService.getComponentesNotaPeriodoAcademicoActivo().subscribe({
      next: (data) => {
        this.componenteNotasPeriodoAcademicoActivo = data;
        this.showLoading = true;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  private construirFormulario() {
    this.componenteNotaForm = this.builder.group({
      totalAcademico: ['', Validators.required],
      totalDisciplinario: ['', Validators.required],
    });

    this.componenteNotaForm.valueChanges.subscribe({
      next: (value) => {
        const totalAcademico = parseFloat(value.totalAcademico) || 0;
        const totalDisciplinario = parseFloat(value.totalDisciplinario) || 0;

        if (!isNaN(totalAcademico) && !isNaN(totalDisciplinario)) {
          this.totalPonderacion = totalAcademico + totalDisciplinario;
          this.totalPonderacion = Number(this.totalPonderacion.toFixed(2));
        } else {
          console.error('Error: Los valores ingresados deben ser números válidos.');
        }

      }
    });
  }

  private mostrarNotificacion(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
  }


  getColorClass() {
    return this.totalPonderacion === 1 ? 'text-success' : 'text-danger';
  }

  onGuardarComponenteNota() {
    const academico = {
      nombre: 'ACADÉMICA',
      porcentajeComponenteNota: this.componenteNotaForm?.value?.totalAcademico,
    }

    const disciplinario = {
      nombre: 'DISCIPLINARIA',
      porcentajeComponenteNota: this.componenteNotaForm?.value?.totalDisciplinario,
    }

    this.formacionService.crearComponenteNota(academico).subscribe({
      next: (response) => {
        this.mostrarNotificacion('Componente académico creado correctamente.', TipoAlerta.ALERTA_OK);
      },
      error: (errorResponse) => {
        console.error(errorResponse);
        this.mostrarNotificacion('Error al crear componente académico.', TipoAlerta.ALERTA_ERROR);
      }
    });

    this.formacionService.crearComponenteNota(disciplinario).subscribe({
      next: (response) => {
        this.mostrarNotificacion('Componente académico creado correctamente.', TipoAlerta.ALERTA_OK);
      },
      error: (errorResponse) => {
        console.error(errorResponse);
        this.mostrarNotificacion('Error al crear componente académico.', TipoAlerta.ALERTA_ERROR);
      }
    });

  }


  onEditarPonderacionNota(nota: ComponenteNota) {
    this.estaEditando = true;
    this.codComponenteNotaEditando = nota.codComponenteNota;
  }

  onCancelarEdicion() {
    this.estaEditando = false;
    this.codComponenteNotaEditando = 0;
  }
}
