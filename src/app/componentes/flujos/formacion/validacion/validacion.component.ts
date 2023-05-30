import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, Subscription, switchMap} from "rxjs";
import {ValidacionInscripcionService} from "../../../../servicios/formacion/validacion-inscripcion.service";
import {ValidacionRequisito} from "../../../../modelo/flujos/formacion/requisito";
import {Notificacion} from "../../../../util/notificacion";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InscripcionCompleta} from "../../../../modelo/flujos/formacion/inscripcion-completa";
import {DocumentosService} from "../../../../servicios/formacion/documentos.service";
import {SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.scss']
})
export class ValidacionComponent implements OnInit, OnDestroy {

  postulanteId: string | null;
  inscripcion: InscripcionCompleta | null;
  requisitos: ValidacionRequisito[];
  formularioRequisitos: FormGroup[];
  loadInformation: boolean;
  headers: string[];
  msmBtnListaRequisitos: string;
  estaExpandidoListaRequisitos: boolean = false;
  urlsArchivo: { SafeResourceUrl, nombreArchivo: string }[];

  private routerSubscription: Subscription;


  constructor(
    private route: ActivatedRoute,
    private validacionInscripcionService: ValidacionInscripcionService,
    private documentosService: DocumentosService,
    private mdbNotificationService: MdbNotificationService,
    private builder: FormBuilder,
    private router: Router
  ) {
    this.postulanteId = null;
    this.inscripcion = null;
    this.requisitos = [];
    this.urlsArchivo = [];
    this.formularioRequisitos = [];
    this.loadInformation = false;
    this.headers = ['Requisito', 'Cumple el requisito', 'Observaciones'];
    this.msmBtnListaRequisitos = 'Posición inferior de la lista de requisitos';

  }

  ngOnInit(): void {
    this.routerSubscription = this.route.paramMap.pipe(
      switchMap((params) => {
        this.postulanteId = params.get('id');
        if (this.postulanteId && !isNaN(+this.postulanteId)) {
          return this.validacionInscripcionService.getInscripcion(+this.postulanteId);
        }
        Notificacion.notificar(this.mdbNotificationService, 'No se pudo obtener la información del postulante', TipoAlerta.ALERTA_ERROR);
        this.router.navigate(['principal/formacion/inscripciones']);
        return [null];
      })
    ).subscribe((inscripcion) => {
      console.log("inscripcion", inscripcion);
      if (inscripcion) {
        this.inscripcion = inscripcion;
        console.log("documentos", this.inscripcion.documentos);
        if (this.inscripcion.documentos.length > 0) {
          const observables = this.inscripcion.documentos.map(documento =>
            this.documentosService.visualizarArchivo(165)
          );

          forkJoin(observables).subscribe({
            next: urls => {
              this.urlsArchivo = urls.map((url, index) => {
                return {
                  SafeResourceUrl: url,
                  nombreArchivo: this.inscripcion.documentos[index].nombre
                }
              });
              console.log("urlsArchivo", this.urlsArchivo);
            },
            error: err => console.log(err, "No se pudo obtener los archivos")
          });
        }
        this.validacionInscripcionService.listarRequisitos(inscripcion?.codPostulante).subscribe({
          next: requisitos => {
            this.requisitos = requisitos;
            this.construirFormulario();
            this.loadInformation = true;
          },
          error: err => console.log(err, "No se pudo obtener los requisitos")
        });
      }
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

  // guardarRequisitosAuto() {
  //
  //   const hayRequisitosTocados = this.formularioRequisitos.some(requisito => requisito.touched);
  //   if (!hayRequisitosTocados) return;
  //
  //   // // si todos los requisitos son validos le digo al usuario que presione el boton de guardar
  //   // const formulariosValidos = this.formularioRequisitos.every(requisito => requisito.valid);
  //   // if (!formulariosValidos) return;
  //
  //   const requisitos = this.formularioRequisitos.filter(requisito => requisito.valid && requisito.touched
  //   ).map(requisito => requisito.value);
  //
  //   Notificacion.notificar(this.mdbNotificationService, 'Se guardaron los cambios pendientes', TipoAlerta.ALERTA_INFO);
  //   console.log(requisitos);
  // }


  toggleListaRequisitos() {
    this.estaExpandidoListaRequisitos = !this.estaExpandidoListaRequisitos;
    this.msmBtnListaRequisitos = this.estaExpandidoListaRequisitos ? 'Posición lateral de la lista de requisitos' : 'Posición inferior de la lista de requisitos';
  }

}
