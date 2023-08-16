import {Component, OnInit} from '@angular/core';
import ServiceTypeEnum from '../../../../enum/service-type.enum';
import {
  ProEstudianteSemestreMateriaService
} from '../../../../servicios/profesionalizacion/pro-estudiante-semestre-materia.service';
import {Semestre} from '../../../../modelo/admin/semestre';
import {Materia} from '../../../../modelo/admin/materias';
import {Observable, of} from 'rxjs';
import { ProSemestreService } from '../../../../servicios/profesionalizacion/pro-semestre.service';
import { ProMateriaService } from '../../../../servicios/profesionalizacion/pro-materia.service';

@Component({
  selector: 'app-pro-est-sem-mat-paralelo',
  templateUrl: './pro-est-sem-mat-paralelo.component.html',
  styleUrls: ['./pro-est-sem-mat-paralelo.component.scss']
})
export class ProEstSemMatParaleloComponent implements OnInit {
  protected readonly type = ServiceTypeEnum.ESTUDIANTE_SEMESTRE_MATERIA_PARALELO;
  public semestres: Semestre[];
  public materias: Materia[];
  selectedSemestre: Semestre;
  selectedMateria: Materia;

  constructor(
    private estudianteSemestreMateriaService: ProEstudianteSemestreMateriaService,
    private semestreService: ProSemestreService,
    private materiaService: ProMateriaService,
  ) {
  }

  ngOnInit(): void {
    this.semestreService.getSemestre().subscribe(resp => this.semestres = resp);
    this.materiaService.listar().subscribe(resp => this.materias = resp);
  }

  public overrideFnList = (): Observable<any> => {
    if (this.selectedMateria && this.selectedSemestre)
      return this.estudianteSemestreMateriaService.getEstudianteBySemestreAndMateria(
        this.selectedMateria.toString(), this.selectedSemestre.toString());
    return of([])
  }
}
