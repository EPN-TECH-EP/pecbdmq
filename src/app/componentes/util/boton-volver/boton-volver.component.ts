import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from "@angular/router";

@Component({
  selector: 'app-boton-volver',
  templateUrl: './boton-volver.component.html',
  styleUrls: ['./boton-volver.component.scss']
})
export class BotonVolverComponent {

  @Input() texto: string = 'Regresar al menú';
  @Input() link: string = '';

  constructor(private location: Location, private rotuer: Router) {
  }

  goBack(): void {
    if (this.link !== '') {
      this.rotuer.navigate([this.link]);
    } else {
    this.location.back();
    }
  }

}
