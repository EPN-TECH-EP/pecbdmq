import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ValidacionInscripcionService } from "../../../../servicios/formacion/validacion-inscripcion.service";
import { ValidacionRequisito } from "../../../../modelo/flujos/formacion/requisito";
import { Notificacion } from "../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DocumentosService } from "../../../../servicios/formacion/documentos.service";
import { forkJoin } from "rxjs";
import { SafeResourceUrl } from "@angular/platform-browser";
import { InscripcionService } from 'src/app/servicios/especializacion/inscripcion.service';
import { InscripcionCompletaEsp } from 'src/app/modelo/flujos/especializacion/inscripcion-completa-esp';
import { ValidacionRequisitoEsp } from 'src/app/modelo/flujos/especializacion/requisito';

@Component({
  selector: 'app-validacion-especializacion',
  templateUrl: './validacion-especializacion.component.html',
  styleUrls: ['./validacion-especializacion.component.scss']
})
export class ValidacionEspecializacionComponent implements OnInit {

  inscripcionId: number | null;
  inscripcion: InscripcionCompletaEsp | null;
  requisitos: ValidacionRequisitoEsp[];
  formularioRequisitos: FormGroup[];
  loadInformation: boolean;
  headers: string[];
  mensajeBtnListaRequisitos: string;
  estaExpandidoListaRequisitos: boolean = false;
  urlsArchivo: {urlSafe: SafeResourceUrl, nombreArchivo: string}[];

  constructor(
    private inscripcionService: InscripcionService,
    private documentosService: DocumentosService,
    private mdbNotificationService: MdbNotificationService,
    private builder: FormBuilder,
    private router: Router
  ) {
    this.inscripcionId = null;
    this.inscripcion = null;
    this.requisitos = [];
    this.urlsArchivo = [];
    this.formularioRequisitos = [];
    this.loadInformation = false;
    this.headers = ['Requisito', 'Cumple el requisito', 'Observaciones'];
    this.mensajeBtnListaRequisitos = 'Posición inferior de la lista de requisitos';

  }

  ngOnInit(): void {

    this.inscripcionId = this.inscripcionService.idInscripcion;
    if (!this.inscripcionId) {
      Notificacion.notificar(this.mdbNotificationService, "No se ha seleccionado una inscripción", TipoAlerta.ALERTA_ERROR);
      this.router.navigate(['principal/especializacion/inscripciones']).then();
      return;
    }

    this.inscripcionService.getInscripcion(this.inscripcionId).subscribe({
      next: inscripcion => {
        console.log("inscripcion", inscripcion);
        this.inscripcion = inscripcion;

        const observables = this.inscripcion?.documentos?.map(documento =>
          this.documentosService.visualizarArchivo(documento.codDocumento)
          );

        if (observables && observables.length > 0) {
          forkJoin(observables).subscribe({
            next: urls => {
              this.urlsArchivo = urls.map((url, index) => ({
                urlSafe: url,
                nombreArchivo: this.inscripcion?.documentos[index]?.nombre
              }));
              console.log("urlsArchivo", this.urlsArchivo);
            },
            error: err => console.log("No se pudo obtener los archivos", err)
          });
        }

        this.inscripcionService.listarRequisitos(this.inscripcionId).subscribe({
          next: requisitos => {
            console.log("requisitos", requisitos);
            this.requisitos = requisitos;
            this.construirFormulario();
            this.loadInformation = true;
          },
          error: err => console.log("No se pudo obtener los requisitos", err)
        });
      },
      error: err => {
        console.log("No se pudo obtener la inscripción", err);
        this.router.navigate(['principal/especializacion/inscripciones']);
      }
    });

    this.inscripcionService.idInscripcion = null;

  }

  private construirFormulario() {

    this.requisitos.forEach(requisito => {
      const requisitoFormGroup = this.builder.group({
        codValidacionRequisito: [requisito?.codValidacionRequisito],
        codRequisito: [requisito?.codRequisito],
        codInscripcion: [requisito?.codInscripcion],
        nombre: [requisito?.nombreRequisito],
        estado: [requisito?.estado],
        observacion: [requisito?.observacion],
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

    const hayRequisitosTocados = this.formularioRequisitos.some(requisito => requisito.touched);
    if (!hayRequisitosTocados) return;
    // solo guardo los requisitos que han sido tocados
    const requisitos: ValidacionRequisitoEsp[] = this.formularioRequisitos.filter(
      requisito => (requisito.touched && requisito.valid)
    ).map(requisito => requisito.value);
    console.log(requisitos);

    this.inscripcionService.guardarRequisitos(requisitos).subscribe({
      next: () => {
        Notificacion.notificar(this.mdbNotificationService, 'Se guardaron los requisitos', TipoAlerta.ALERTA_INFO);
        this.router.navigate(['principal/especializacion/inscripciones']);
      },
      error: err => {
        Notificacion.notificar(this.mdbNotificationService, 'No se pudo guardar los requisitos', TipoAlerta.ALERTA_ERROR);
        console.log("No se pudo guardar los requisitos", err);
    }
    });

  }


  toggleListaRequisitos() {
    this.estaExpandidoListaRequisitos = !this.estaExpandidoListaRequisitos;
    this.mensajeBtnListaRequisitos = this.estaExpandidoListaRequisitos ? 'Posición lateral de la lista de requisitos' : 'Posición inferior de la lista de requisitos';
  }

}
