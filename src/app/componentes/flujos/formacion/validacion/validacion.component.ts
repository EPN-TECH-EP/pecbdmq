import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";
import {ValidacionInscripcionService} from "../../../../servicios/formacion/validacion-inscripcion.service";
import {Inscripcion} from "../../../../modelo/flujos/formacion/inscripcion";

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.scss']
})
export class ValidacionComponent implements OnInit {

  postulanteId: string | null = null;
  inscripcion: Inscripcion | null = null;

  constructor(
    private route: ActivatedRoute,
    private validacionInscripcionService: ValidacionInscripcionService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.postulanteId = params.get('id');
        if (this.postulanteId) {
          console.log(this.postulanteId)
          return this.validacionInscripcionService.getPostulante(+this.postulanteId);
        }
        return [null];
      }
    ))
    .subscribe((inscripcion) => {
      this.inscripcion = inscripcion;
    })
  }

}
