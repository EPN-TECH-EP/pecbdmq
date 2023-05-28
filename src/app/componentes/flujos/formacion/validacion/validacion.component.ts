import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {ValidacionInscripcionService} from "../../../../servicios/formacion/validacion-inscripcion.service";
import {Inscripcion} from "../../../../modelo/flujos/formacion/inscripcion";
import {ValidacionRequisito} from "../../../../modelo/flujos/formacion/requisito";
import {Notificacion} from "../../../../util/notificacion";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.scss']
})
export class ValidacionComponent implements OnInit, OnDestroy {

  postulanteId: string | null;
  inscripcion: Inscripcion | null;
  requisitos: ValidacionRequisito[];
  formularioRequisitos: FormGroup[];
  loadInformation: boolean;
  headers: string[];
  private routerSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private validacionInscripcionService: ValidacionInscripcionService,
    private mdbNotificationService: MdbNotificationService,
    private builder: FormBuilder,
    private router: Router
  ) {
    this.postulanteId = null;
    this.inscripcion = null;
    this.requisitos = [];
    this.loadInformation = false;
    this.formularioRequisitos = [];
    this.headers = ['Requisito', 'Cumple el requisito', 'Observaciones'];
    window.addEventListener('unload', () => {
      this.guardarRequisitosAuto();
    });
  }

  ngOnInit(): void {
    // this.route.paramMap.pipe(
    //   switchMap((params) => {
    //     this.postulanteId = params.get('id');
    //     if (this.postulanteId && !isNaN(+this.postulanteId)) {
    //       console.log(this.postulanteId);
    //       return this.validacionInscripcionService.getInscripcion(+this.postulanteId);
    //     }
    //     Notificacion.notificar(this.mdbNotificationService, 'No se pudo obtener la información del postulante', TipoAlerta.ALERTA_ERROR);
    //     return [null];
    //   })
    // ).subscribe((inscripcion) => {
    //   if (inscripcion) {
    //     this.inscripcion = inscripcion;
    //     this.validacionInscripcionService.listarRequisitos().subscribe({
    //       next: requisitos => {
    //         this.requisitos = requisitos;
    //         this.loadInformation = true;
    //       },
    //       error: err => console.log(err)
    //     });
    //   }
    // });
    // TODO: Eliminar esto
    this.validacionInscripcionService.listarRequisitos().subscribe({
      next: requisitos => {
        this.requisitos = requisitos;
        this.construirFormulario();
        this.loadInformation = true;
      },
      error: err => console.log(err)
    });
    // when the user leaves the page to go to another page on our site
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.guardarRequisitosAuto();
      }
    });

    // when the user reloads, closes, or navigates away from the page
    window.addEventListener('beforeunload', () => {
      this.guardarRequisitosAuto();
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private construirFormulario() {

    this.requisitos.forEach(requisito => {
      const requisitoFormGroup = this.builder.group({
        codRequisitos: [requisito?.cod_requisitos],
        nombre: [requisito?.nombre_requisito],
        estado: [requisito?.estado, [Validators.required]],
        observaciones: [requisito?.observaciones]
      });

      this.formularioRequisitos.push(requisitoFormGroup);
    });
    // observo los cambios en el formulario
    this.formularioRequisitos.forEach(requisito => {
      requisito.valueChanges.subscribe(value => {
        console.log(value);
      });
    });
  }

  guardarRequisitos() {
    const formulariosValidos = this.formularioRequisitos.every(requisito => requisito.valid);

    this.formularioRequisitos.forEach(requisito => {
      if (!requisito.valid) requisito.markAllAsTouched()
    });

    if (!formulariosValidos) {
      Notificacion.notificar(this.mdbNotificationService, 'Por favor llenar todos los campos necesarios', TipoAlerta.ALERTA_ERROR);
      return;
    }

    const requisitos = this.formularioRequisitos.map(requisito => requisito.value);
    console.log(requisitos)
  }

  guardarRequisitosAuto() {

    const hayRequisitosTocados = this.formularioRequisitos.some(requisito => requisito.touched);
    if (!hayRequisitosTocados) return;

    // // si todos los requisitos son validos le digo al usuario que presione el boton de guardar
    // const formulariosValidos = this.formularioRequisitos.every(requisito => requisito.valid);
    // if (!formulariosValidos) return;

    const requisitos = this.formularioRequisitos.filter(
      requisito => requisito.valid && requisito.touched
    ).map(requisito => requisito.value);
    Notificacion.notificar(this.mdbNotificationService, 'Se guardaron los cambios pendientes', TipoAlerta.ALERTA_INFO);
    console.log(requisitos);
  }

}
