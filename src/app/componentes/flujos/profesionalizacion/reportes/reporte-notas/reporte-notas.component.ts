import {Component, OnInit, ViewChild} from '@angular/core';
import {ProPeriodo} from "../../../../../modelo/admin/profesionalizacion/pro-periodo";
import {Semestre} from "../../../../../modelo/admin/semestre";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {ProPeriodoService} from "../../../../../servicios/profesionalizacion/pro-periodo.service";
import {ProSemestreService} from "../../../../../servicios/profesionalizacion/pro-semestre.service";
import {MdbPaginationChange} from "../../../../../../../code/mdb-angular-ui-kit/table";
import {
  ProNotaProfesionalizacionDto
} from "../../../../../modelo/flujos/profesionalizacion/pro-nota-profesionalizacion-general.models";
import {ProNotaService} from "../../../../../servicios/profesionalizacion/pro-nota.service";
import * as XLSX from "xlsx";


@Component({
  selector: 'app-reporte-notas',
  templateUrl: './reporte-notas.component.html',
  styleUrls: ['./reporte-notas.component.scss']
})
export class ReporteNotasComponent implements OnInit {

  paginaActual: number = 0;
  entradasPorPagina: number = 0;
  indiceAuxRegistro: number = 0;

  selectedPeriodo: ProPeriodo;
  selectedSemestre: Semestre;
  semestres: Semestre[];
  periodos: ProPeriodo[];
  listado: ProNotaProfesionalizacionDto[];
  @ViewChild('table') table!: MdbTableDirective<ProPeriodo>;
  headers = [
    'Promoción',
    'Nivel',
    'Materia',
    'Paralelo/Proyecto',
    'Nombres',
    'Apellidos',
    'Nota Parcial 1',
    'Nota Parcial 2',
    'Nota Practica',
    'Nota Asistencia',
  ];

  constructor(private periodoService: ProPeriodoService, private notasService: ProNotaService,
              private semestreService: ProSemestreService) {
  }

  ngOnInit(): void {
    this.periodoService.listar().subscribe((result) => {
      this.periodos = [];
      this.periodos.push({codigoPeriodo: 0, nombrePeriodo: 'Todos'})
      this.periodos.push(...result);
    }, (error) => {
    })

    this.semestreService.listar().subscribe((result) => {
      this.semestres = [];
      this.semestres.push({estado: "", codSemestre: 0, semestre: 'Todos'})
      this.semestres.push(...result);
    }, (error) => {
    });
  }

  onSelectPeriodoChange() {
    this.notasService.getByAll(this.selectedSemestre ? this.selectedSemestre.codSemestre : 0, this.selectedPeriodo.codigoPeriodo).subscribe((response) => {
        this.listado = response;
      },
      (error) => {
      })
  }

  onSelectSemestreoChange() {
    this.notasService.getByAll( this.selectedSemestre.codSemestre, this.selectedPeriodo ? this.selectedPeriodo.codigoPeriodo : 0).subscribe((response) => {
        this.listado = response;
      },
      (error) => {
      })
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  onPaginationChange(event: MdbPaginationChange): void {
    this.paginaActual = event.page;
    this.entradasPorPagina = event.entries;
    if (this.paginaActual > 0) {
      this.indiceAuxRegistro = this.paginaActual * this.entradasPorPagina;
    }
  }

  name = 'ReporteNotas.xlsx';
  onClickMe(): void {
    let element = document.getElementById('proyectoTbl');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }
}
