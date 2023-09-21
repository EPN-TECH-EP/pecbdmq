import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-modal-apeliacion-nota',
  templateUrl: './modal-apeliacion-nota.component.html',
  styleUrls: ['./modal-apeliacion-nota.component.scss']
})
export class ModalApeliacionNotaComponent implements OnInit {

  constructor(public modalRef: MdbModalRef<ModalApeliacionNotaComponent>) {}

  ngOnInit(): void {
  }

}
