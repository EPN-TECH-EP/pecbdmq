import { Component, OnInit } from '@angular/core';
import { DatosSincronizados, LlamamientoDosService } from "../servicios/llamamiento-dos.service";

@Component({
  selector: 'app-llamamiento-dos',
  templateUrl: './llamamiento-dos.component.html',
  styleUrls: ['./llamamiento-dos.component.scss']
})
export class LlamamientoDosComponent implements OnInit {

  datosSincronizados: DatosSincronizados[] = []
  constructor(private llamamientoService: LlamamientoDosService) { }

  ngOnInit(): void {
    this.llamamientoService.listarFuncionarios().subscribe({
      next: (data) => {
        console.log(data)
        this.datosSincronizados = data
      }
    })
  }

}
