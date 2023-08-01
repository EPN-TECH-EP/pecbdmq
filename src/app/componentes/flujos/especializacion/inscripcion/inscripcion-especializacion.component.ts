import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { MyValidators } from "../../../../util/validators";
import { debounceTime } from "rxjs/operators";
import { EspInscripcionService } from "../../../../servicios/especializacion/esp-inscripcion.service";
import { DatoPersonal } from "../../../../modelo/admin/dato-personal";

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion-especializacion.component.html',
  styleUrls: ['./inscripcion-especializacion.component.scss']
})
export class InscripcionEspecializacionComponent implements OnInit {

  fechaActual: Date;
  cedula: FormControl;
  datoPersonal: DatoPersonal;
  correoPersonal: FormControl;

  constructor(
    private inscripcionService: EspInscripcionService,
  ) {
    this.fechaActual = new Date();
    this.datoPersonal = null;
    this.cedula = new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      MyValidators.validIdentification(),
      MyValidators.onlyNumbers()],
    );
    this.correoPersonal = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);

    this.escucharCedula()
  }

  ngOnInit(): void {
  }

  private escucharCedula() {
    this.cedula.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        if (this.cedula.valid) {
          this.obtenerDatos(value);
        }
      }
    })
  }

  private obtenerDatos(cedula: string) {
    this.inscripcionService.getDatosPostulante(cedula).subscribe({
      next: (datos) => {
        console.log(datos);
        this.datoPersonal = {
          nombre: datos.nombre,
          apellido: datos.apellido,
          correoPersonal: null,
          ...this.datoPersonal
        };
      }
    })
  }

  confirmarInscripcion() {
    if(this.correoPersonal.invalid){
      this.correoPersonal.markAllAsTouched();
      return;
    }
  }
}
