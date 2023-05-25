import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PopconfirmComponent} from "../popconfirm/popconfirm.component";
import {MdbPopconfirmRef, MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";

@Component({
  selector: 'app-estado-proceso-stepper',
  templateUrl: './estado-proceso-stepper.component.html',
  styleUrls: ['./estado-proceso-stepper.component.scss']
})
export class EstadoProcesoStepperComponent implements OnInit {

  @Input("steps") set changeSteps(newSteps: any[]) {
    this.steps = newSteps;
  }

  @Output() updatedStep = new EventEmitter<number>();

  disabledPreviousButton = false;
  disabledNextButton = false;
  popConfirmRef: MdbPopconfirmRef<PopconfirmComponent> | null = null;
  steps: any[];

  private currentStep: any;
  private nextStep: any;
  private previousStep: any;

  constructor(private popConfirmService: MdbPopconfirmService) {
    this.steps = [];
    this.currentStep = null;
    this.nextStep = null;
    this.previousStep = null;
  }

  ngOnInit(): void {
    this.foundCurrentStep()
  }


  getStepClass(estado: string): string {
    const stepClasses = {
      actual: 'actual',
      siguiente: 'siguiente',
      completado: 'completado'
    };
    return stepClasses[estado] || '';
  }

  private foundCurrentStep() {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      if (step.estadoActual === 'actual') {
        this.currentStep = step;
        this.nextStep = this.steps[i + 1];
        this.previousStep = this.steps[i - 1];
        break;
      }
    }
  }

  getPreviousStep() {
    let foundPrevious = false;
    for (let i = this.steps.length - 1; i >= 0; i--) {
      const step = this.steps[i];
      if (step.estadoActual === 'actual') {
        step.estadoActual = 'siguiente';
        this.disabledNextButton = false;
      }
      if (!foundPrevious && step.estadoActual === 'completado') {
        step.estadoActual = 'actual';
        foundPrevious = true;
        this.disabledNextButton = false;
        this.currentStep = step;
        this.foundCurrentStep()
        this.updatedStep.emit(this.currentStep?.codigo);
      }
      if (i === 0 && !foundPrevious) {
        step.estadoActual = 'actual';
        this.disabledPreviousButton = true;
      }

    }
  }

  getNextStep() {
    let foundNext = false;
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      if (step.estadoActual === 'actual') {
        step.estadoActual = 'completado';
        foundNext = true;
        this.disabledPreviousButton = false;
      }
      if (foundNext && step.estadoActual === 'siguiente') {
        step.estadoActual = 'actual';
        foundNext = false;
        this.disabledPreviousButton = false;
        this.currentStep = step;
        this.foundCurrentStep()
        this.updatedStep.emit(this.currentStep?.codigo);
      }
      if (i === this.steps.length - 1 && foundNext) {
        this.disabledNextButton = true;
      }
    }
  }

  openPopConfirmNextStep(event: Event) {
    const target = event.target as HTMLElement;

    this.openPopConfirm(target,
      `¿Está seguro que desea cambiar el estado del proceso a ${this.nextStep?.estadoCatalogo}?`,
      () => {
        this.getNextStep();
      });
  }

  openPopConfirmPreviousStep(event: Event) {
    const target = event.target as HTMLElement;

    this.openPopConfirm(target,
      `¿Está seguro que desea cambiar el estado del proceso a ${this.previousStep?.estadoCatalogo}?`
      , () => {
        this.getPreviousStep();
      });
  }

  private openPopConfirm(target: HTMLElement, message, callback: () => void) {
    this.popConfirmRef = this.popConfirmService.open(
      PopconfirmComponent,
      target,
      {popconfirmMode: 'modal', data: {mensaje: message}}
    );

    if (this.popConfirmRef.onConfirm) {
      this.popConfirmRef.onConfirm.subscribe(callback);
    }
  }

}
