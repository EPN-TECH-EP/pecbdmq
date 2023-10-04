import { Component, OnInit } from '@angular/core';
import { MateriaFormacion, MateriasFormacionService } from "../../../../servicios/formacion/materias-formacion.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { catchError, tap } from "rxjs/operators";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { throwError } from "rxjs";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { OPCIONES_DATEPICKER } from "../../../../util/constantes/opciones-datepicker.const";
import { Router } from "@angular/router";

export interface DocumentoMateria {
  codigoRepo: number;
  codDocumento: number;
  codigoMateriaCurso: number;
  esTarea: boolean;
  ruta: string;
  nombre: string;
  descripcion: string;

}

@Component({
  selector: 'app-for-repo-materia',
  templateUrl: './for-repo-materia.component.html',
  styleUrls: ['./for-repo-materia.component.scss']
})
export class ForRepoMateriaComponent implements OnInit {

  materia: MateriaFormacion;
  addRow: boolean;
  estaEditando: boolean;
  documentoForm: FormGroup;
  documentos: DocumentoMateria[] = [];
  archivo: File = null;
  headers = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
  ]
  codigoDocumentoEditando: number = 0;
  esTarea: boolean;

  constructor(
    private materiasService: MateriasFormacionService,
    private ns: MdbNotificationService, private builder: FormBuilder,
    private router: Router,) {
    this.materia = null;
    this.addRow = false;
    this.esTarea = false;
    this.estaEditando = false;
    this.documentoForm = new FormGroup({});
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.materia = this.materiasService.materia;
    if (this.materia === null) {
      this.router.navigate(['/principal/formacion/academia/materias']);
      return;
    }
    this.listarDocumentos();
  }

  private construirFormulario() {
    this.documentoForm = this.builder.group({
      descripcion: ['', Validators.required],
      archivo: ['', Validators.required],
      esTarea: [false]
    });
    this.documentoForm.controls['esTarea'].valueChanges.subscribe(value => {
      if (value) {
        this.documentoForm.addControl('fechaEntrega', this.builder.control('', Validators.required));
        this.esTarea = value;
        this.documentoForm.controls['fechaEntrega'].valueChanges.subscribe(value => {
          const dia = value.getDate();
          const mes = value.getMonth() + 1;
          const anio = value.getFullYear();
          const fecha = `${ dia < 10 ? '0' + dia : dia }/${ mes < 10 ? '0' + mes : mes }/${ anio }`;

          this.documentoForm.controls['descripcion'].setValue(`Tarea para el ${ fecha }`);
        });
      }
    });
  }

  private listarDocumentos() {
    this.materiasService.listarDocumentosPorMateria(this.materia.codMateriaPeriodo, this.materia.codParalelo).subscribe({
      next: (documentos) => {
        this.documentos = documentos;
      },
      error: (err) => {
        Notificacion.notificar(this.ns, "Error al listar documentos", TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  cargarArchivo(event: any) {
    this.archivo = event.target.files[0];
  }

  guardarArchivo() {
    if (this.documentoForm.invalid) {
      this.documentoForm.markAllAsTouched();
    }

    const formData = new FormData();

    formData.append('archivo', this.archivo);
    formData.append('esTarea', this.esTarea.toString());
    formData.append('materia', this.materia.codMateriaPeriodo.toString());
    formData.append('paralelo', this.materia.codParalelo.toString());
    formData.append('descripcion', this.documentoForm.controls['descripcion'].value);

    // Convertir FormData en un objeto JavaScript regular
    const formObject = {};
    formData.forEach((valor, clave) => {
      formObject[clave] = valor;
    });

    // los imprimo en un mismo objeto
    const objeto = {
      ...formObject,
    }

    console.log(objeto);

    this.materiasService.guardarArchivosPorMateria(formData).subscribe({
      next: response => {
        Notificacion.notificar(this.ns, "Documento guardado correctamente", TipoAlerta.ALERTA_OK);
        this.documentoForm.reset();
        this.archivo = null;
        this.esTarea = false;
        this.addRow = false;
        this.estaEditando = false;
        this.codigoDocumentoEditando = 0;

      }
    })

  }

  descargarArchivoEsp(documento: any) {

  }

  eliminar(codEstudianteMateriaDocumento: any) {

  }

  toggleEsTarea() {
    this.esTarea = !this.esTarea;
  }

  protected readonly OPCIONES_DATEPICKER = OPCIONES_DATEPICKER;
}
