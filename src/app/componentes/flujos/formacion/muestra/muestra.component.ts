import { Component, OnInit } from '@angular/core';
import { InscripcionCompleta } from "../../../../modelo/flujos/formacion/inscripcion-completa";
import { ValidacionRequisito } from "../../../../modelo/flujos/formacion/requisito";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SafeResourceUrl } from "@angular/platform-browser";
import { ValidacionInscripcionService } from "../../../../servicios/formacion/validacion-inscripcion.service";
import { DocumentosService } from "../../../../servicios/formacion/documentos.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { Router } from "@angular/router";
import { MuestraService } from "../../../../servicios/formacion/muestra.service";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { forkJoin } from "rxjs";

@Component({
  selector: 'app-muestra',
  templateUrl: './muestra.component.html',
  styleUrls: ['./muestra.component.scss']
})
export class MuestraComponent implements OnInit {

  muestraId: number | null;
  muestra: InscripcionCompleta | null;
  requistosInscripcion: ValidacionRequisito[];
  requisitosMuestra: ValidacionRequisito[];
  formularioRequisitos: FormGroup[];
  formularioRequisitosMuestra: FormGroup[];
  loadInformation: boolean;
  headers: string[];
  estaExpandidoListasRequisitos: boolean = false;
  urlsArchivo: {urlSafe: SafeResourceUrl, nombreArchivo: string}[];
  mensajeBtnListasRequisitos: string;

  constructor(
    private validacionInscripcionService: ValidacionInscripcionService,
    private muestraService: MuestraService,
    private documentosService: DocumentosService,
    private mdbNotificationService: MdbNotificationService,
    private builder: FormBuilder,
    private router: Router
  ) {
    this.muestraId = null;
    this.muestra = null;
    this.urlsArchivo = [];
    this.requisitosMuestra = [];
    this.requistosInscripcion = [];
    this.formularioRequisitos = [];
    this.formularioRequisitosMuestra = [];
    this.loadInformation = false;
    this.mensajeBtnListasRequisitos = 'Posición inferior de la lista de requisitos';
    this.headers = ['Requisito', 'Cumple el requisito', 'Observaciones'];
  }

  ngOnInit(): void {
    this.muestraId = this.muestraService.idMuestra;
    console.log("muestraId", this.muestraId);

    if (!this.muestraId) {
      Notificacion.notificar(this.mdbNotificationService, "No se ha seleccionado un postulante para muestreo", TipoAlerta.ALERTA_ERROR);
      this.router.navigate(['principal/formacion/inscripciones']).then();
      return;
    }

    this.muestraService.getMuestra(this.muestraId).subscribe({
      next: muestra => {
        console.log("muestra", muestra);
        this.muestra = muestra;

        const observables = this.muestra?.documentos?.map(documento =>
          this.documentosService.visualizarArchivo(documento.codDocumento)
        );

        if (observables && observables.length > 0) {
          forkJoin(observables).subscribe({
            next: urls => {
              this.urlsArchivo = urls.map((url, index) => ({
                urlSafe: url,
                nombreArchivo: this.muestra?.documentos[index]?.nombre
              }));
              console.log("urlsArchivo", this.urlsArchivo);
            },
            error: err => console.log("No se pudo obtener los archivos", err)
          });
        }
        this.validacionInscripcionService.listarRequisitos(this.muestra?.codPostulante).subscribe({
          next: requisitos => {
            console.log("requisitos muestra", requisitos);
            this.requistosInscripcion = requisitos;
            this.requisitosMuestra = requisitos;
            this.construirFormularios();
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

    this.muestraService.idMuestra = null;

  }

  private construirFormularios() {

    this.requistosInscripcion.forEach(requisito => {
      const requisitoInscripcionFormGroup = this.builder.group({
        codRequisitos: [requisito?.codRequisitos],
        codValidacion: [requisito?.codValidacion],
        codPostulante: [requisito?.codPostulante],
        nombre: [requisito?.nombreRequisito],
        estado: [requisito?.estado],
        observaciones: [requisito?.observaciones],
        estadoMuestra: [requisito?.estadoMuestra],
        observacionMuestra: [requisito?.observacionMuestra]
      });
      this.formularioRequisitos.push(requisitoInscripcionFormGroup);
    });

    // desactivar los campos de los requisitos que no se pueden modificar
    this.formularioRequisitos.forEach(formGroup => {
      formGroup.disable();
    })

    this.requisitosMuestra.forEach(requisito => {
      const requisitoMuestraFormGroup = this.builder.group({
        codRequisitos: [requisito?.codRequisitos],
        codValidacion: [requisito?.codValidacion],
        codPostulante: [requisito?.codPostulante],
        nombre: [requisito?.nombreRequisito],
        estado: [requisito?.estado],
        observaciones: [requisito?.observaciones],
        estadoMuestra: [requisito?.estadoMuestra],
        observacionMuestra: [requisito?.observacionMuestra]
      });
      this.formularioRequisitosMuestra.push(requisitoMuestraFormGroup);
    });

    // observo los cambios en el formulario
    this.formularioRequisitosMuestra.forEach(requisito => {
      requisito.valueChanges.subscribe(value => {
        console.log(value);
      });
    });

  }


  toggleListasRequisitos() {
    this.estaExpandidoListasRequisitos = !this.estaExpandidoListasRequisitos;
    this.mensajeBtnListasRequisitos = this.estaExpandidoListasRequisitos ? 'Posición lateral de la lista de requisitos' : 'Posición inferior de la lista de requisitos';
  }

  guardarMuestra() {
    const hayRequisitosMuestraTocados = this.formularioRequisitosMuestra.some(requisito => requisito.touched);

    if (!hayRequisitosMuestraTocados) return;
    const requisitos: ValidacionRequisito[] = this.formularioRequisitosMuestra.filter(
      requisito => (requisito.touched && requisito.valid)
    ).map(requisito => requisito.value);
    console.log(requisitos);

    this.muestraService.guardarRequisitos(requisitos).subscribe({
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
}
