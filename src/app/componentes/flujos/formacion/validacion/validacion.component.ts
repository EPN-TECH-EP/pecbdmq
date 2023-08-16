import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ValidacionInscripcionService } from "../../../../servicios/formacion/validacion-inscripcion.service";
import { ValidacionRequisito } from "../../../../modelo/flujos/formacion/requisito";
import { Notificacion } from "../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { FormBuilder, FormGroup } from "@angular/forms";
import { InscripcionCompleta } from "../../../../modelo/flujos/formacion/inscripcion-completa";
import { DocumentosService } from "../../../../servicios/formacion/documentos.service";
import { forkJoin } from "rxjs";
import { SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.scss']
})
export class ValidacionComponent implements OnInit {

  postulanteId: number | null;
  inscripcion: InscripcionCompleta | null;
  requisitos: ValidacionRequisito[];
  formularioRequisitos: FormGroup[];
  loadInformation: boolean;
  headers: string[];
  mensajeBtnListaRequisitos: string;
  estaExpandidoListaRequisitos: boolean = false;
  urlsArchivo: {urlSafe: SafeResourceUrl, nombreArchivo: string}[];

  constructor(
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
    this.mensajeBtnListaRequisitos = 'Posición inferior de la lista de requisitos';

  }

  ngOnInit(): void {

    this.postulanteId = this.validacionInscripcionService.idPostulante;
    if (!this.postulanteId) {
      Notificacion.notificar(this.mdbNotificationService, "No se ha seleccionado un postulante", TipoAlerta.ALERTA_ERROR);
      this.router.navigate(['principal/formacion/inscripciones']).then();
      return;
    }

    this.validacionInscripcionService.getInscripcion(this.postulanteId).subscribe({
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

        this.validacionInscripcionService.listarRequisitos(this.inscripcion?.codPostulante).subscribe({
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
        this.router.navigate(['principal/formacion/inscripciones']);
      }
    });

    this.validacionInscripcionService.idPostulante = null;

  }

  private construirFormulario() {

    this.requisitos.forEach(requisito => {
      const requisitoFormGroup = this.builder.group({
        codRequisitos: [requisito?.codRequisitos],
        codValidacion: [requisito?.codValidacion],
        codPostulante: [requisito?.codPostulante],
        nombre: [requisito?.nombreRequisito],
        estado: [requisito?.estado],
        observaciones: [requisito?.observaciones],
        estadoMuestra: [requisito?.estadoMuestra],
        observacionMuestra: [requisito?.observacionMuestra]
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
    const requisitos: ValidacionRequisito[] = this.formularioRequisitos.filter(
      requisito => (requisito.touched && requisito.valid)
    ).map(requisito => requisito.value);
    console.log(requisitos);

    this.validacionInscripcionService.guardarRequisitos(requisitos).subscribe({
      next: () => {
        Notificacion.notificar(this.mdbNotificationService, 'Se guardaron los requisitos', TipoAlerta.ALERTA_INFO);
        this.router.navigate(['principal/formacion/inscripciones']);
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

  // retornar edad en años y meses a la fecha de inscripción
  calcularEdad(fechaNacimiento?: string, fechaInscripcion?: string): string {

    // si un parámetro es null, retornar cadena vacía
    if (!fechaNacimiento || !fechaInscripcion) return '';
    // si un parámetro es vacío, retornar cadena vacía
    if (fechaNacimiento.trim() === '' || fechaInscripcion.trim() === '') return '';

    const fechaNacimientoDate = new Date(fechaNacimiento);
    const fechaInscripcionDate = new Date(fechaInscripcion);
    const anios = fechaInscripcionDate.getFullYear() - fechaNacimientoDate.getFullYear();
    const meses = fechaInscripcionDate.getMonth() - fechaNacimientoDate.getMonth();
    return `${anios} años y ${meses} meses`;
  }

}
