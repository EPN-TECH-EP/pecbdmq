import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput, EventSourceInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { PeriodoAcademicoService } from "../../../servicios/periodo-academico.service";

@Component({
  selector: 'app-calendario-formacion',
  templateUrl: './calendario-formacion.component.html',
  styleUrls: ['./calendario-formacion.component.scss']
})
export class CalendarioFormacionComponent implements OnInit {


  events: EventInput[] = [];

  constructor(private periodoAcademicoService: PeriodoAcademicoService) {}

  ngOnInit(): void {


    this.periodoAcademicoService.obtenerPeriodoAcademicoActivo().subscribe({
      next: (data) => {
        console.log(data)
        // obtenemos fecha de inicio y fecha de fin
        const fechaInicio = new Date(data.fechaInicio)
        const fechaFin = new Date(data.fechaFin)
        // agregamos un di ya que trae la fecha de fin con un dia menos
        fechaInicio.setDate(fechaInicio.getDate() + 1)
        fechaFin.setDate(fechaFin.getDate() + 9)

        //imprimimos
        console.log(fechaInicio)
        console.log(fechaFin)

        // agregamos evento
        this.events = [
          {
            title: 'Periodo Académico',
            start: fechaInicio,
            end: fechaFin,
            color: 'green'
          },
          {
            title: 'Inicio del Periodo Académico',
            date: fechaInicio,
            backgroundColor: 'blue',
            color: 'white'
          },
          {
            title: 'Fin del Periodo Académico',
            date: fechaFin,
            color: 'red'
          }
        ]
      }
    })
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    locale: 'es',
  };
}
