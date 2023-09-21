import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendario-formacion',
  templateUrl: './calendario-formacion.component.html',
  styleUrls: ['./calendario-formacion.component.scss']
})
export class CalendarioFormacionComponent implements OnInit {

  currentYear: number;
  calendarData: any[] = []; // Debes llenar este arreglo con los datos de los días del año
  months: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor() { }

  ngOnInit() {
    this.currentYear = new Date().getFullYear(); // Obtén el año actual

    // Llena el arreglo calendarData con los datos de los días del año
    this.generateCalendarData();
  }

  generateCalendarData() {
    // Itera por cada mes del año (de 0 a 11, donde 0 es enero y 11 es diciembre)
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(this.currentYear, month + 1, 0).getDate(); // Obtén el número de días en el mes
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(this.currentYear, month, day);
        this.calendarData.push({
          day: day,
          month: month + 1, // Añade 1 porque los meses en JavaScript van de 0 a 11
          date: currentDate
        });
      }
    }
  }
}
