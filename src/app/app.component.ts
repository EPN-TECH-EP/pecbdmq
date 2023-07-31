import { Component, OnInit, OnChanges } from '@angular/core';
import { AutenticacionService } from './servicios/autenticacion.service';
import { AutenticacionGuard } from './guard/autenticacion.guard';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MyValidators } from "./util/validators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges {
  title = 'Plataforma Educativo - CBDMQ';

  constructor(private autenticacionService: AutenticacionService, private router: Router){

/*     router.events.subscribe((val) => {
      // see also
      console.log(val)
      });*/
  }

  public isLoggedIn() : boolean {
    return this.autenticacionService.isUsuarioLoggedIn();
  }

  ngOnInit() {
    console.info("Inicia app")
  }

  ngOnChanges() {
    console.info("Finaliza app")
  }

}
