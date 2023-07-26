import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ComponenteNota, FormacionService } from "../../../../../servicios/formacion/formacion.service";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { Notificacion } from "../../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { concat } from "rxjs";

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
  totalPonderacionEditando: number;
  headers: {key: string; label: string;}[]
  ponderacionAcademico: FormControl;
  ponderacionDisciplina: FormControl

  constructor(
    private builder: FormBuilder,
    private formacionService: FormacionService,
    private ns: MdbNotificationService,
  ) {
    this.componenteNotaForm = new FormGroup({});
    this.totalPonderacion = 0;
    this.estaEditando = false;
    this.showLoading = false;
    this.componenteNotasPeriodoAcademicoActivo = []
    this.headers = [
      { key: 'nombre', label: 'Nombre' },
      { key: 'ponderacion', label: 'Ponderación' },
    ]
    this.ponderacionAcademico = new FormControl('', Validators.required);
    this.ponderacionDisciplina = new FormControl('', Validators.required);
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

    this.ponderacionAcademico.valueChanges.subscribe({
      next: (value) => {
        this.totalPonderacionEditando = (value || 0) + (this.ponderacionDisciplina.value || 0);
        this.totalPonderacionEditando = Number(this.totalPonderacionEditando.toFixed(2));
      }
    })
    this.ponderacionDisciplina.valueChanges.subscribe({
      next: (value) => {
        this.totalPonderacionEditando = (value || 0) + (this.ponderacionAcademico.value || 0);
        this.totalPonderacionEditando = Number(this.totalPonderacionEditando.toFixed(2));
      }
    });

  }

  private mostrarNotificacion(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
  }

  getColorClass() {
    return (this.totalPonderacion === 1 || this.totalPonderacionEditando === 1) ? 'text-success' : 'text-danger';
  }

  onGuardarComponenteNota() {
    const academico = {
      nombre: 'ACADÉMICA',
      porcentajeComponenteNota: this.componenteNotaForm?.value?.totalAcademico,
    };

    const disciplinario = {
      nombre: 'DISCIPLINARIA',
      porcentajeComponenteNota: this.componenteNotaForm?.value?.totalDisciplinario,
    };

    const crearComponenteNota = (componente) => {
      return this.formacionService.crearComponenteNota(componente);
    };

    concat(
      crearComponenteNota(academico),
      crearComponenteNota(disciplinario)
    ).subscribe({
      next: () => {
        this.mostrarNotificacion('Componentes académico y disciplinario creados correctamente.', TipoAlerta.ALERTA_OK);
        this.formacionService.getComponentesNotaPeriodoAcademicoActivo().subscribe({
          next: (data) => {
            this.componenteNotasPeriodoAcademicoActivo = data;
            this.showLoading = true;
            this.estaEditando = false;
          },
          error: (error) => {
            console.error(error);
          }
        });
      },
      error: (errorResponse) => {
        console.error(errorResponse);
        this.mostrarNotificacion('Error al crear componentes académico y disciplinario.', TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  onEditarPonderacionNota() {
    this.estaEditando = true;
    this.ponderacionAcademico.setValue(this.componenteNotasPeriodoAcademicoActivo[0].porcentajeComponenteNota);
    this.ponderacionDisciplina.setValue(this.componenteNotasPeriodoAcademicoActivo[1].porcentajeComponenteNota);
  }

  onCancelarEdicion() {
    this.estaEditando = false;
    this.totalPonderacionEditando = 0;
    this.totalPonderacion = 0
  }

  onActualizarNota() {
    const actualizarComponenteNota = (componente, idComponente) => {
      return this.formacionService.actualizarComponenteNota(componente, idComponente);
    };

    const actualizarComponente = (nombre, ponderacion, idComponente) => {
      const componente = {
        nombre,
        porcentajeComponenteNota: ponderacion,
        estado: 'ACTIVO'
      };

      actualizarComponenteNota(componente, idComponente).subscribe({
        next: (response) => {
          this.formacionService.getComponentesNotaPeriodoAcademicoActivo().subscribe({
            next: (data) => {
              this.componenteNotasPeriodoAcademicoActivo = data;
              this.showLoading = true;
              this.estaEditando = false;
              this.totalPonderacionEditando = 0;
              this.totalPonderacion = 0;
              this.componenteNotasPeriodoAcademicoActivo = [...this.componenteNotasPeriodoAcademicoActivo];
            },
            error: (errorResponse) => {
              console.error(errorResponse);
              this.mostrarNotificacion('Error al actualizar componentes de nota.', TipoAlerta.ALERTA_ERROR)
            }
          });
          this.mostrarNotificacion(`Componente ${ nombre } actualizado correctamente.`, TipoAlerta.ALERTA_OK);
        },
        error: (errorResponse) => {
          console.error(errorResponse);
        }
      });
    };

    const idComponenteAcademico = this.componenteNotasPeriodoAcademicoActivo.find((componente) => componente.nombre === 'ACADÉMICA')?.codComponenteNota;
    const idComponenteDisciplinario = this.componenteNotasPeriodoAcademicoActivo.find((componente) => componente.nombre === 'DISCIPLINARIA')?.codComponenteNota;

    const ponderacionAcademico = this.ponderacionAcademico.value;
    const ponderacionDisciplinario = this.ponderacionDisciplina.value;

    actualizarComponente('ACADÉMICA', ponderacionAcademico, idComponenteAcademico);
    actualizarComponente('DISCIPLINARIA', ponderacionDisciplinario, idComponenteDisciplinario);

  }

}
