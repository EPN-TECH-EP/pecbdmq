import {Component, OnInit, ViewChild} from '@angular/core';
import {ProPeriodo} from "../../../../../modelo/admin/profesionalizacion/pro-periodo";
import {ProPeriodoService} from "../../../../../servicios/profesionalizacion/pro-periodo.service";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {ProSemestreService} from "../../../../../servicios/profesionalizacion/pro-semestre.service";
import {ProMateriaSemestreDto} from "../../../../../modelo/flujos/profesionalizacion/pro-materia-semestre.models";
import {MdbPaginationChange} from "../../../../../../../code/mdb-angular-ui-kit/table";
import {ProMateriaService} from "../../../../../servicios/profesionalizacion/pro-materia.service";
import {Semestre} from "../../../../../modelo/admin/semestre";
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-reporte-general',
  templateUrl: './reporte-general.component.html',
  styleUrls: ['./reporte-general.component.scss']
})
export class ReporteGeneralComponent implements OnInit {

  spreadBackColor = 'aliceblue';
  hostStyle = {
    width: '95vw',
    height: '80vh'
  };
  private spread;
  private excelIO;

  paginaActual: number = 0;
  entradasPorPagina: number = 0;
  indiceAuxRegistro: number = 0;

  selectedPeriodo: ProPeriodo;
  selectedSemestre: Semestre;
  semestres: Semestre[];
  periodos: ProPeriodo[];
  listado: ProMateriaSemestreDto[];
  @ViewChild('table') table!: MdbTableDirective<ProPeriodo>;
  headers = [
    'Cohorte',
    'Nivel',
    'Materia',
  ];

  constructor(private periodoService: ProPeriodoService, private materiasService: ProMateriaService,
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
    this.materiasService.getByAll(this.selectedSemestre ? this.selectedSemestre.codSemestre : 0, this.selectedPeriodo.codigoPeriodo).subscribe((response) => {
        this.listado = response;
      },
      (error) => {
      })
  }

  onSelectSemestreoChange() {
    this.materiasService.getByAll( this.selectedSemestre.codSemestre, this.selectedPeriodo ? this.selectedPeriodo.codigoPeriodo : 0).subscribe((response) => {
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

  name = 'ReporteMaterias.xlsx';
  onClickMe(): void {
    let element = document.getElementById('proyectoTbl');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

}
