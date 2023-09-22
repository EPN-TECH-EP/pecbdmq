import {Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from "xlsx";


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  selectedTipoReporte: string = 'Reporte Inscritos';
  tiposReporte: string[];

  selectedPeriodo: string = 'Todos';
  periodos: string[];

  selectedAula: string = 'Todas';
  aulas: string[];

  selectedParalelo: string = 'Todos';
  paralelos: string[];

  title: string;

  constructor(private titleService: Title, private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.route.data.subscribe(data => {
      const pageTitle = data.title || 'Reportes general';
  
      this.titleService.setTitle(pageTitle);
      this.title = pageTitle;
    });

    this.tiposReporte = [
      'Reporte Inscritos',
      'Reporte Validaciones',
      'Reporte Admitidos',
      'Reporte Notas',
      'Reporte Aprobados',
      'Reporte Reprobados',
      'Reporte Instructores',
    ]

    this.periodos = [
      'Todos',
      '2023-09-04 / 2023-09-05',
      '2023-09-18 / 2023-09-18',
      '2023-09-19 / 2023-09-19',
      '2023-09-19 /  2023-09-19'
    ]

    this.aulas = [
      'Todas',
      'Aula Quitumbe',
      'Prehospitalaria',
      'Magna',
      'Planta Baja'
    ]

    this.paralelos = [
      'Todos',
      'A',
      'B',
      'C',
      'D'
    ]
  }

  onSelectTipoReporte() {
    
  }

  name = 'Reporte.xlsx';
  onClickMe(): void {
    const data = [
      ['Cédula', 'Nombres', 'Edad', 'Ciudad', 'Correo', 'Celular', 'Fecha Registro'],
      ['1105232568', 'Juan Molina', 29, 'Quito', 'jmolina@gmail.com', '0991456233', '2023-09-02'],
      ['1103452567', 'María Toapanta', 25, 'Cuenca', 'mtoapanta@hotmail.com', '0991345232', '2023-09-03'],
      ['1106782563', 'Luis Valencia', 24, 'Ibarra', 'lvalencia@yahoo.es', '0991678231', '2023-09-07'],
    ];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, ws, 'Sheet1');

    XLSX.writeFile(book, this.name);
  }

}
