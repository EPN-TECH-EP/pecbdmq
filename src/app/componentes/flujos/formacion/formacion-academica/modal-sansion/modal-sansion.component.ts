import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-modal-sansion',
  templateUrl: './modal-sansion.component.html',
  styleUrls: ['./modal-sansion.component.scss']
})
export class ModalSansionComponent implements OnInit {

  constructor( modalRef: MdbModalRef<ModalSansionComponent>){

  }

  ngOnInit(): void {
  }

}
