import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Notificacion} from "../../../../util/notificacion";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DocumentosService} from "../../../../servicios/formacion/documentos.service";
import {forkJoin} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";
import {ProInscripcionDto} from "../../../../modelo/flujos/profesionalizacion/pro-inscripcion.models";
import {ProCumpleRequisitosService} from "../../../../servicios/profesionalizacion/pro-cumple-requisitos.service";
import {ProCumpleRequisitosDto} from "../../../../modelo/flujos/profesionalizacion/pro-cumple-requisitos.models";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";

@Component({
  selector: 'app-validacion',
  templateUrl: './pro-validacion-requisitos.component.html',
  styleUrls: ['./pro-validacion-requisitos.component.scss']
})
export class ProValidacionRequisitosComponent implements OnInit {

  codInscripcion: number | null;
  inscripcion: ProInscripcionDto | null;
  requisitos: ProCumpleRequisitosDto[];
  formularioRequisitos: FormGroup[];
  loadInformation: boolean;
  headers: string[];
  mensajeBtnListaRequisitos: string;
  estaExpandidoListaRequisitos: boolean = false;
  urlsArchivo: { urlSafe: SafeResourceUrl, nombreArchivo: string }[];

  constructor(
    private cumpleRequisitosService: ProCumpleRequisitosService,
    private documentosService: DocumentosService,
    private mdbNotificationService: MdbNotificationService,
    private builder: FormBuilder,
    private router: Router,
    private modalService: MdbModalService,
    public modalRef: MdbModalRef<ProValidacionRequisitosComponent>
  ) {
    this.codInscripcion = null;
    this.inscripcion = null;
    this.requisitos = [];
    this.urlsArchivo = [];
    this.formularioRequisitos = [];
    this.loadInformation = false;
    this.headers = ['Requisito', 'Cumple el requisito', 'Observaciones'];
    this.mensajeBtnListaRequisitos = 'Posición inferior de la lista de requisitos';

  }

  ngOnInit(): void {

    this.codInscripcion = this.cumpleRequisitosService.idPostulante;
    if (!this.codInscripcion) {
      Notificacion.notificar(this.mdbNotificationService, "No se ha seleccionado un postulante", TipoAlerta.ALERTA_ERROR);
      this.router.navigate(['principal/profesionalizacion/pro-validacion-requisitos']).then();
      return;
    }

    this.cumpleRequisitosService.getInscripcion(this.codInscripcion).subscribe({
      next: inscripcion => {
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

        this.cumpleRequisitosService.listarRequisitos(this.codInscripcion).subscribe({
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

    this.cumpleRequisitosService.idPostulante = null;

  }

  private construirFormulario() {

    this.requisitos.forEach(requisito => {
      const requisitoFormGroup = this.builder.group({
        codRequisito: [requisito?.codRequisito],
        codInscripcion: [requisito?.codInscripcion],
        nombre: [requisito?.nombreRequisito],
        observaciones: [requisito?.observaciones],
        observacionMuestra: [requisito?.observacionMuestra],
        cumple: [requisito?.cumple],
        codCumpleRequisito: [requisito?.codCumpleRequisito]
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
    const requisitos: ProCumpleRequisitosDto[] = this.formularioRequisitos.map(requisito => requisito.value);
    console.log(requisitos);

    this.cumpleRequisitosService.guardarRequisitos(requisitos).subscribe({
      next: () => {
        Notificacion.notificar(this.mdbNotificationService, 'Se guardaron los requisitos', TipoAlerta.ALERTA_INFO);
        this.router.navigate(['principal/profesionalizacion/pro-listado-inscripcion-delegado']);
        this.modalRef.close();
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
