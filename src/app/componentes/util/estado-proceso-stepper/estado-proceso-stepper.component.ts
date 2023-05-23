import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModuloEstado} from "../../../modelo/admin/modulo-estado";

@Component({
  selector: 'app-estado-proceso-stepper',
  templateUrl: './estado-proceso-stepper.component.html',
  styleUrls: ['./estado-proceso-stepper.component.scss']
})
export class EstadoProcesoStepperComponent implements OnInit {

  @Input() steps: any[];
  @Output() nextStepEvent = new EventEmitter<string>();
  @Output() previousStepEvent = new EventEmitter<string>();

  disabledPreviousButton = false;
  disabledNextButton = false;

  constructor() {
    this.steps = [];
  }

  ngOnInit(): void {
    console.log(this.steps)
  }

  getStepClass(estado: string): string {
    const stepClasses = {
      actual: 'actual',
      siguiente: 'siguiente',
      completado: 'completado'
    };
    return stepClasses[estado] || '';
  }


  previousStep() {
    let foundPrevious = false;
    for (let i = this.steps.length - 1; i >= 0; i--) {
      const step = this.steps[i];
      if (step.estadoActual === 'actual') {
        step.estadoActual = 'siguiente';
      }
      if (!foundPrevious && step.estadoActual === 'completado') {
        step.estadoActual = 'actual';
        foundPrevious = true;
      }
      if (i === 0 && !foundPrevious) {
        step.estadoActual = 'actual';
        this.disabledPreviousButton = true;
      }

    }
  }



  nextStep() {
    let foundNext = false;
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      if (step.estadoActual === 'actual') {
        step.estadoActual = 'completado';
        foundNext = true;
      }
      if (foundNext && step.estadoActual === 'siguiente') {
        step.estadoActual = 'actual';
        foundNext = false;
      }
      if (i === this.steps.length - 1 && foundNext) {
        this.disabledNextButton = true;
      }
    }
  }
}
