import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-esp-apelaciones-ins',
  templateUrl: './esp-apelaciones-ins.component.html',
  styleUrls: ['./esp-apelaciones-ins.component.scss']
})
export class EspApelacionesInsComponent implements OnInit {
  headers: {key: string, label: string}[] = [
    { key: 'fecha', label: 'Fecha solicitud' },
    { key: 'estudiante', label: 'Estudiante' },
    { key: 'observacion', label: 'Observación Estudiante' },
    { key: 'observacion', label: 'Nota Actual' },
    { key: 'observacion', label: 'Observación Instructor' },
    { key: 'observacion', label: 'Nota Corregida' },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
