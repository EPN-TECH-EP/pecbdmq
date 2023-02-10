import { Component, Input, OnInit } from '@angular/core';
import { TipoAlerta } from '../../../enum/tipo-alerta';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.scss'],
})
export class AlertaComponent implements OnInit {
  //@Input() tipo!: TipoAlerta;
  public mensaje!: string;
  public clase: string;
  ALERTA = 'alert-dismissible fade show ';

  constructor() {}

  ngOnInit(): void {    
  }

  getClase(): string {    
    return (this.clase ? this.clase : 'alert-info');
  }
}
