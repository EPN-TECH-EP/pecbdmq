import { Component, OnInit } from '@angular/core';
import { DatosSincronizados, LlamamientoDosService } from "../servicios/llamamiento-dos.service";
import { MdbModalRef, MdbModalService } from "mdb-angular-ui-kit/modal";
import {
  ModalLlamamientoRequisitosComponent
} from "../llamamiento/modal-llamamiento-requisitos/modal-llamamiento-requisitos.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-llamamiento-dos',
  templateUrl: './llamamiento-dos.component.html',
  styleUrls: ['./llamamiento-dos.component.scss']
})
export class LlamamientoDosComponent implements OnInit {

  modalRef: MdbModalRef<ModalLlamamientoRequisitosComponent> | null = null;

  datosSincronizados: DatosSincronizados[] = []
  constructor(
    private router: Router,
    private llamamientoService: LlamamientoDosService, private modalService: MdbModalService) { }

  ngOnInit(): void {
    this.llamamientoService.listarFuncionarios().subscribe({
      next: (data) => {
        console.log(data)
        this.datosSincronizados = data
      }
    })
  }

  openModal() {
    this.modalRef = this.modalService.open(ModalLlamamientoRequisitosComponent)
  }

  verNotasFicha() {
    this.router.navigate(['/principal/llamamiento-dos/notas-ficha']).then()
  }
}
