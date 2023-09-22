import { Component, OnInit, ViewChild } from '@angular/core';
import { MdbTableDirective } from "mdb-angular-ui-kit/table";
import { MdbModalRef, MdbModalService } from "mdb-angular-ui-kit/modal";
import { ModalApeliacionNotaComponent } from "../modal-apeliacion-nota/modal-apeliacion-nota.component";
import { PostulanteItem, PostulantesValidosService } from "../../../servicios/formacion/postulantes-validos.service";
import { CalendarOptions, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

export interface Person {
  codigoUnico: string;
  aprobado: boolean;
}


@Component({
  selector: 'app-resultados-inscripciones',
  templateUrl: './resultados-inscripciones.component.html',
  styleUrls: ['./resultados-inscripciones.component.scss']
})
export class ResultadosInscripcionesComponent implements OnInit {


  // Primer filtro: Validación de requisitos
  postulantesValidacionRequisitos: PostulanteItem[] = [];

  // Calendario
  events: EventInput[] = [];
  eventsAux: any[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    locale: 'es',
  };

  // Apelaciones pruebas academicas
  modalRef: MdbModalRef<ModalApeliacionNotaComponent> | null = null;
  @ViewChild('tableResultadosAcademicas') tableResultadosAcademicas!: MdbTableDirective<Person>;


  // Segundo filtro: Pruebas
  resultadosAperovacionValidacionRequisitos: Person[] = [
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '1725664641', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
  ];

  resultadosPruebasAcademicas: Person[] = [
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '1725664641', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
  ]

  resultadosPruebasPsicologicas: Person[] = [
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '1725664641', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
  ]

  resultadosPruebasFisicas: Person[] = [
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '1725664641', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
  ]

  resultadosPruebasMedicas: Person[] = [
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '1725664641', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
  ]
  // headers
  headersAcademicas = ['Código único', 'Aprobado', 'Acciones'];
  headers = ['Código único', 'Aprobado'];
  headersValidacionRequisitos = ['Código único', 'Aprobado',];

  constructor(private modalService: MdbModalService, private postulantesService: PostulantesValidosService) {}

  ngOnInit(): void {
    this.postulantesService.listarPostulantesValidosEInvalidos().subscribe({
      next: (postulantes) => {
        this.postulantesValidacionRequisitos = postulantes;
      }
    });

    this.postulantesService.listarPruebas().subscribe({
      next: (pruebas) => {
        console.log(pruebas);
        pruebas.forEach((prueba) => {
          const fechaInicio = new Date(prueba.fechaInicio);
          const fechaFin = new Date(prueba.fechaFin);
          fechaInicio.setDate(fechaInicio.getDate() + 1);
          fechaFin.setDate(fechaFin.getDate() + 1);

          const backgroundColor = this.getRandomColorName();

          this.eventsAux.push({
            title: prueba.tipoPruebaNombre,
            start: fechaInicio,
            end: fechaFin,
            backgroundColor: backgroundColor,
          });

        });
        this.events = this.eventsAux;
      }
    })
  }

  getRandomColorName(): string {
    const colorNames = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown'];
    const randomIndex = Math.floor(Math.random() * colorNames.length);
    return colorNames[randomIndex];
  }

  searchTableResultadosAcademicas(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.tableResultadosAcademicas.search(searchTerm);
  }

  openModal() {
    this.modalRef = this.modalService.open(ModalApeliacionNotaComponent)
  }


}
