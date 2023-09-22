import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from "mdb-angular-ui-kit/modal";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { Notificacion } from "../../../util/notificacion";
import { TipoAlerta } from "../../../enum/tipo-alerta";

@Component({
  selector: 'app-modal-apeliacion-nota',
  templateUrl: './modal-apeliacion-nota.component.html',
  styleUrls: ['./modal-apeliacion-nota.component.scss']
})
export class ModalApeliacionNotaComponent implements OnInit {

  constructor(
    public modalRef: MdbModalRef<ModalApeliacionNotaComponent>,
    private ns: MdbNotificationService
  ) {}

  ngOnInit(): void {
  }

  apelarNota() {
    Notificacion.notificar(this.ns, "Se ha enviado su apelación de nota", TipoAlerta.ALERTA_OK);
    this.modalRef.close();
  }
}
