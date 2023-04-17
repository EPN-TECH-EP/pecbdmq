import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-boton-volver',
  templateUrl: './boton-volver.component.html',
  styleUrls: ['./boton-volver.component.scss']
})
export class BotonVolverComponent {

  constructor(private location: Location) {
  }

  goBack(): void {
    this.location.back();
  }

}
