import { Component, OnInit } from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-modal-sesion-expirada',
  templateUrl: './modal-sesion-expirada.component.html',
  styleUrls: ['./modal-sesion-expirada.component.scss']
})
export class ModalSesionExpiradaComponent implements OnInit {

  constructor(
    public modalRef: MdbModalRef<ModalSesionExpiradaComponent>,
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modalRef.close();
  }

}
