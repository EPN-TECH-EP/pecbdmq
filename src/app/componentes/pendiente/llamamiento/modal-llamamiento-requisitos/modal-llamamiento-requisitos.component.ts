import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-modal-llamamiento-requisitos',
  templateUrl: './modal-llamamiento-requisitos.component.html',
  styleUrls: ['./modal-llamamiento-requisitos.component.scss']
})
export class ModalLlamamientoRequisitosComponent implements OnInit {

  requisitos: {requisito: string, fecha: Date, estado: string}[] = [
    { requisito: 'Requisito 1', fecha: new Date(), estado: 'Aprobado' },
    { requisito: 'Requisito 2', fecha: new Date(), estado: 'Aprobado' },
    { requisito: 'Requisito 3', fecha: new Date(), estado: 'Aprobado' },
  ];

  constructor(public modalRef: MdbModalRef<ModalLlamamientoRequisitosComponent>) {}

  ngOnInit(): void {

  }

}
