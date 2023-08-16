import { Component, OnInit } from '@angular/core';
import {ComponenteBase} from '../../../../util/componente-base';
import {
  defaultParaleloMateria,
  ProMateriaParaleloDto
} from '../../../../modelo/flujos/profesionalizacion/pro-paralelo-materia.models';
import {ProPeriodo} from '../../../../modelo/admin/profesionalizacion/pro-periodo';
import {ProSemestre} from '../../../../modelo/admin/profesionalizacion/pro-semestre';
import {ProPeriodoSemestreDto} from '../../../../modelo/flujos/profesionalizacion/pro-periodo-semestre.models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProMateriaService} from '../../../../servicios/profesionalizacion/pro-materia.service';
import {ProParaleloService} from '../../../../servicios/profesionalizacion/pro-paralelo.service';
import {ProPeriodoSemestreService} from '../../../../servicios/profesionalizacion/pro-periodo-semestre.service';
import {ProPeriodoService} from '../../../../servicios/profesionalizacion/pro-periodo.service';
import {MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {forkJoin, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Notificacion} from '../../../../util/notificacion';
import {ProNotaFinalService} from '../../../../servicios/profesionalizacion/pro-nota-final.service';
import {ProNotaFinalModels} from '../../../../modelo/flujos/profesionalizacion/pro-nota-final.models';

@Component({
  selector: 'app-pro-nota-final',
  templateUrl: './pro-nota-final.component.html',
  styleUrls: ['./pro-nota-final.component.scss']
})
export class ProNotaFinalComponent extends ComponenteBase implements OnInit {
  selectedItem: ProMateriaParaleloDto;
  selectedPeriodo: number;
  selectedListPeriodos: ProPeriodo[];
  selectedPeriodoSemestre: ProSemestre;
  selectedListSemestres: ProPeriodoSemestreDto[];
  formGroup: FormGroup;

  constructor(
    private builder: FormBuilder,
    private materiasService: ProMateriaService,
    private proNotaFinalService: ProNotaFinalService,
    private paraleloService: ProParaleloService,
    private periodoSemestreService: ProPeriodoSemestreService,
    private periododService: ProPeriodoService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.selectedItem = defaultParaleloMateria;
    this.formGroup = new FormGroup({});
  }

  estudiantesNotas: ProNotaFinalModels[] = [];
  notasForm: FormGroup[] = [];

  crearFormularioNotas() {
    const formControls = {};
    this.notasForm = [];
    for (const nota of this.estudiantesNotas) {
      const fm = this.builder.group({
        [`codEstudiante`]: [nota.codEstudiante, Validators.required],
        [`nombreLabel`]: [`${nota.nombre} ${nota.apellido}`, Validators.required],
        [`notaParcial1`]: [nota.notaParcial1, Validators.min(0)],
        [`notaParcial2`]: [nota.notaParcial2, Validators.min(0)],
        [`notaPractica`]: [nota.notaPractica, Validators.min(0)],
        [`notaAsistencia`]: [nota.notaAsistencia, Validators.min(0)],
        [`notaFinal`]: [nota.notaFinal, Validators.min(0)]
      });
      formControls[String(nota.codEstudiante)] = fm;
      this.notasForm.push(fm);
    }
  }

  loadModifiedNotas() {
    const observables = [];
    this.showLoading = true;
    for (const notaForm of this.notasForm) {
      const codigoEstudiante = notaForm.get('codEstudiante').value;
      const notaEstudiante = this.estudiantesNotas.find(nota => nota.codEstudiante === codigoEstudiante);

      console.log('comprobanding')
      console.log(notaForm.value)
      console.log(notaEstudiante)
      if (this.hasNotasChange(notaForm.value, notaEstudiante)) {
        const request: ProNotaFinalModels= {
          estado: 'ACTIVO',
          notaParcial1: notaForm.get('notaParcial1').value || undefined,
          notaParcial2: notaForm.get('notaParcial2').value || undefined,
          notaPractica: notaForm.get('notaPractica').value || undefined,
          notaAsistencia: notaForm.get('notaAsistencia').value || undefined,
          notaFinal: notaForm.get('notaFinal').value || undefined,
          codEstudianteSemestre: 0,
          codEstudiante: notaForm.get('codEstudiante').value,
          codSemestre: this.selectedPeriodoSemestre.codSemestre,
          // notaMinima: 0,
          // pesoMateria: 0,
          // numeroHoras: 0,
          // notaMateria: 0,
          // notaPonderacion: 0,
          // notaDisciplina: 0,
          // notaSupletorio: 0
        };

        const observable = notaEstudiante.codNotaProfesionalizacionFinal ?
          this.proNotaFinalService.actualizar(request, notaEstudiante.codNotaProfesionalizacionFinal) :
          this.proNotaFinalService.crear(request);

        observables.push(observable);
      }
    }

    forkJoin(observables).pipe(
      catchError((error) => {
        this.showLoading = false;
        console.error('El proceso ha fallado:', error);
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          null,
          'Ocurrió un error al actualizar las notas'
        );
        return of(null);
      })
    ).subscribe(() => {
      this.showLoading = false;
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        'Actualización de notas realizada con éxito'
      );
    });
  }

  hasNotasChange(estudianteNota: any, notasEstudiante: any): boolean {
    return (
      (estudianteNota.notaParcial1 !== notasEstudiante?.notaParcial1) ||
      (estudianteNota.notaParcial2 !== notasEstudiante?.notaParcial2) ||
      (estudianteNota.notaPractica !== notasEstudiante?.notaPractica) ||
      (estudianteNota.notaAsistencia !== notasEstudiante?.notaAsistencia)
    );
  }

  ngOnInit(): void {
    this.periododService.listar().subscribe((response) => {
      this.selectedListPeriodos = response;
    })
  }

  onSelectChange() {
    this.periodoSemestreService.getAllByPeriodo(this.selectedPeriodo).subscribe({
      next: (result) => {
        this.selectedListSemestres = result;
      }
    });
  }

  onSelectSemestreChange() {
    this.proNotaFinalService.listNotasByCodPeriodoSemestre(this.selectedPeriodoSemestre.codPeriodoSemestre).subscribe(
      (data) => {
        this.estudiantesNotas = data;
        this.crearFormularioNotas();
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
