import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { OPCIONES_DATEPICKER } from "../../../../util/constantes/opciones-datepicker.const";

@Component({
  selector: 'app-esp-ins-calendario',
  templateUrl: './esp-ins-calendario.component.html',
  styleUrls: ['./esp-ins-calendario.component.scss']
})
export class EspInsCalendarioComponent implements OnInit {

  esVistaAgregarActividad: boolean = false;
  actividadForm: FormGroup = new FormGroup({});
  esTarea: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private ns: MdbNotificationService) {
    this.esVistaAgregarActividad = false;
    this.actividadForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });

  }

  ngOnInit(): void {
  }

  onAgregarActividad() {
    this.esVistaAgregarActividad = !this.esVistaAgregarActividad;
  }

  onGuardarActividad() {

    if (this.actividadForm.invalid) {
      this.actividadForm.markAllAsTouched();
      Notificacion.notificar(this.ns, 'Por favor, ingrese los datos requeridos', TipoAlerta.ALERTA_ERROR);
      return;
    }

    Notificacion.notificar(this.ns, 'Actividad guardada', TipoAlerta.ALERTA_OK);
    this.esVistaAgregarActividad = false;
    this.actividadForm.reset();

  }

  protected readonly OPCIONES_DATEPICKER = OPCIONES_DATEPICKER

  protected readonly onchange = onchange;

  onChangeEsTarea($event: any) {
    this.esTarea = $event.target.checked;
    if (this.esTarea) {
      this.actividadForm.addControl('archivo', this.formBuilder.control('', Validators.required));
    } else {
      this.actividadForm.removeControl('archivo');
    }
  }

}
