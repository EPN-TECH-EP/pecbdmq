import { Component, OnInit, ViewChild } from '@angular/core';
import { MdbTableDirective } from "mdb-angular-ui-kit/table";
import { MdbModalRef, MdbModalService } from "mdb-angular-ui-kit/modal";
import { ModalApeliacionNotaComponent } from "../modal-apeliacion-nota/modal-apeliacion-nota.component";

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

  modalRef: MdbModalRef<ModalApeliacionNotaComponent> | null = null;
  @ViewChild('table') table!: MdbTableDirective<Person>;

  constructor(private modalService: MdbModalService) {}

  ngOnInit(): void {}

  headers = ['Código único', 'Aprobado', 'Acciones'];

  dataSource: Person[] = [
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '987654321', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '987654321', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '987654321', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '987654321', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '987654321', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '987654321', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '987654321', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '987654321', aprobado: false },
    { codigoUnico: '123456789', aprobado: true },
    { codigoUnico: '987654321', aprobado: false },
  ];

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  openModal() {
    this.modalRef = this.modalService.open(ModalApeliacionNotaComponent)
  }
}
