import { Component, OnInit } from '@angular/core';
import { OPCIONES_DATEPICKER } from "../../../util/constantes/opciones-datepicker.const";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Notificacion } from "../../../util/notificacion";
import { TipoAlerta } from "../../../enum/tipo-alerta";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";

@Component({
  selector: 'app-calendario-instructor',
  templateUrl: './calendario-instructor.component.html',
  styleUrls: ['./calendario-instructor.component.scss']
})
export class CalendarioInstructorComponent implements OnInit {
  esVistaAgregarActividad: boolean = false;
  actividadForm: FormGroup = new FormGroup({});

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

  protected readonly OPCIONES_DATEPICKER = OPCIONES_DATEPICKER;
}
