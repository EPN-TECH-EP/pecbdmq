import {Component, Input} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-boton-volver',
  templateUrl: './boton-volver.component.html',
  styleUrls: ['./boton-volver.component.scss']
})
export class BotonVolverComponent {

  @Input() texto: string = 'Regresar al menú';

  constructor(private location: Location) {
  }

  goBack(): void {
    this.location.back();
  }

}
