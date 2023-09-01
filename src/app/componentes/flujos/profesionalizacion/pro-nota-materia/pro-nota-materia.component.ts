import {Component, OnInit} from '@angular/core';
import {ProMateriaSemestreDto} from '../../../../modelo/flujos/profesionalizacion/pro-materia-semestre.models';
import {ProPeriodo} from '../../../../modelo/admin/profesionalizacion/pro-periodo';
import {ProPeriodoSemestreDto} from '../../../../modelo/flujos/profesionalizacion/pro-periodo-semestre.models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Materia} from '../../../../modelo/admin/materias';
import {ProPeriodoSemestreService} from '../../../../servicios/profesionalizacion/pro-periodo-semestre.service';
import {ProPeriodoService} from '../../../../servicios/profesionalizacion/pro-periodo.service';
import {ProMateriaSemestreService} from '../../../../servicios/profesionalizacion/pro-materia-semestre.service';
import {ProMateriaService} from '../../../../servicios/profesionalizacion/pro-materia.service';
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {
  defaultParaleloMateria,
  ProMateriaParaleloDto
} from '../../../../modelo/flujos/profesionalizacion/pro-paralelo-materia.models';
import {ProMateriaParaleloService} from '../../../../servicios/profesionalizacion/pro-paralelo-materia.service';
import {ProParaleloService} from '../../../../servicios/profesionalizacion/pro-paralelo.service';
import {ProNotaService} from '../../../../servicios/profesionalizacion/pro-nota.service';
import {ProEstudianteParaleloService} from '../../../../servicios/profesionalizacion/pro-estudiante-paralelo.service';
import {ProSemestre} from '../../../../modelo/admin/profesionalizacion/pro-semestre';
import {ProNotaDtoModels} from '../../../../modelo/flujos/profesionalizacion/pro-nota-dto.models';
import {forkJoin, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Notificacion} from '../../../../util/notificacion';
import {ComponenteBase} from '../../../../util/componente-base';
import {MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ProParaleloInstructorService} from "../../../../servicios/profesionalizacion/pro-paralelo-instructor.service";
import {ProParaleloInsructorDto} from "../../../../modelo/flujos/profesionalizacion/pro-paralelo-instructor.modelo";
import {CargaArchivoService} from "../../../../servicios/carga-archivo";
import {HttpErrorResponse} from "@angular/common/http";
import {
  ProNotaProfesionalizacionGeneralService
} from "../../../../servicios/profesionalizacion/pro-nota-profesionalizacion-general.service";
import {DocumentosService} from "../../../../servicios/formacion/documentos.service";
import {SafeResourceUrl} from "@angular/platform-browser";
import { ProConvocatoriaService } from '../../../../servicios/profesionalizacion/pro-convocatoria.service';
import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';
import { PROFESIONALIZACION } from 'src/app/util/constantes/profesionalizacion.const';

@Component({
  selector: 'app-pro-nota-materia',
  templateUrl: './pro-nota-materia.component.html',
  styleUrls: ['./pro-nota-materia.component.scss']
})
export class ProNotaMateriaComponent extends ComponenteBase implements OnInit {
  selectedItem: ProMateriaParaleloDto;
  seletedItemPeriodo: number;
  selectedListPeriodos: ProPeriodo[];
  seletedItemSemestre: ProSemestre;
  selectedListSemestres: ProPeriodoSemestreDto[];
  selectedListMaterias: ProMateriaSemestreDto[];
  headers: { key: string, label: string }[];
  formGroup: FormGroup;
  materiasList: Materia[];
  paralelosList: ProMateriaParaleloDto[];
  seletedItemMateria: ProMateriaSemestreDto;
  selectedParalelo: ProMateriaParaleloDto;
  selectedInstructor: ProParaleloInsructorDto;
  tamMaxArchivo = 0;
  showServicioNoDisponible = false;
  noHayConvocatoria = false;
  docNotas: File[];
  urlsArchivo: { urlSafe: SafeResourceUrl, nombreArchivo: string }[];
  constructor(
    private cargaArchivoService: CargaArchivoService,
    private builder: FormBuilder,
    private materiaSemestreService: ProMateriaSemestreService,
    private proConvocatoriaService: ProConvocatoriaService,
    private materiasService: ProMateriaService,
    private proNotaService: ProNotaService,
    private paraleloService: ProParaleloService,
    private periodoSemestreService: ProPeriodoSemestreService,
    private periododService: ProPeriodoService,
    private proMateriaParaleloService: ProMateriaParaleloService,
    private proEstudianteParaleloService: ProEstudianteParaleloService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private proInstructorParaleloService: ProParaleloInstructorService,
    private proNotaProfesionalizacionGeneralService: ProNotaProfesionalizacionGeneralService,
    private documentosService: DocumentosService,
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.headers = [
      {key: 'nombreParalelo', label: 'Paralelo'},
    ]
    this.selectedItem = defaultParaleloMateria;
    this.formGroup = new FormGroup({});
  }

  estudiantesNotas: ProNotaDtoModels[] = [];
  notasForm: FormGroup[] = [];
  generalForm: FormGroup;

  crearFormularioNotas() {
    const formControls = {};
    this.notasForm = [];
    for (const nota of this.estudiantesNotas) {
      const fm = this.builder.group({
        [`codEstudiante`]: [nota.codEstudiante, Validators.required],
        [`codMateriaParalelo`]: [nota.codEstudianteSemestreMateriaParalelo, Validators.required],
        [`nombreLabel`]: [`${nota.nombre} ${nota.apellido}`, Validators.required],
        [`notaParcial1`]: [nota.notaParcial1, Validators.min(0)],
        [`notaParcial2`]: [nota.notaParcial2, Validators.min(0)],
        [`notaPractica`]: [nota.notaPractica, Validators.min(0)],
        [`notaAsistencia`]: [nota.notaAsistencia, Validators.min(0)]
      });
      formControls[String(nota.codEstudiante)] = fm;
      this.notasForm.push(fm);
    }
  }

  loadModifiedNotas() {
    const observables = [];
    this.showLoading = true;
    for (const notaForm of this.notasForm) {
      const codigoEstudiante = notaForm.get('codEstudiante').value;
      const notaEstudiante = this.estudiantesNotas.find(nota => nota.codEstudiante === codigoEstudiante);

      if (this.hasNotasChange(notaForm.value, notaEstudiante)) {
        const request: ProNotaDtoModels = {
          estado: 'ACTIVO',
          codEstudianteSemestreMateriaParalelo: notaForm.get('codMateriaParalelo').value,
          notaParcial1: notaForm.get('notaParcial1').value || undefined,
          notaParcial2: notaForm.get('notaParcial2').value || undefined,
          notaPractica: notaForm.get('notaPractica').value || undefined,
          notaAsistencia: notaForm.get('notaAsistencia').value || undefined,
          codInstructor: this.selectedInstructor.codInstructor, // TODO call from back
          codEstudiante: notaForm.get('codEstudiante').value,
          codMateria: this.seletedItemMateria.codMateria,
          codSemestre: this.seletedItemSemestre.codSemestre,
          notaMinima: 0,
          pesoMateria: 0,
          numeroHoras: 0,
          notaMateria: 0,
          notaPonderacion: 0,
          notaDisciplina: 0,
          notaSupletorio: 0
        };

        const observable = notaEstudiante.codNotaProfesionalizacion ?
          this.proNotaService.actualizar(request, notaEstudiante.codNotaProfesionalizacion) :
          this.proNotaService.crear(request);

        observables.push(observable);
      }
    }

    forkJoin(observables).pipe(
      catchError((error) => {
        this.showLoading = false;
        console.error('El proceso ha fallado:', error);
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          null,
          'Ocurrió un error al actualizar las notas'
        );
        return of(null);
      })
    ).subscribe(() => {
      this.showLoading = false;
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        'Actualización de notas realizada con éxito'
      );
    });

    let formData = new FormData();
    formData.append('datosNotas', JSON.stringify(this.generalForm.value));
    this.docNotas.forEach(value => {
      formData.append('docsNotas', value);
    });

    this.proNotaProfesionalizacionGeneralService.crearGeneralConDocumentos(formData).subscribe({
      next: (resp) => {
        Notificacion.notificacionOK(
          this.notificationRef,
          this.notificationServiceLocal,
          'Archivos registrados con exito'
        );
      },
      error: (errorResponse: HttpErrorResponse) => {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          errorResponse
        );
      }
    })

  }

  hasNotasChange(estudianteNota: any, notasEstudiante: any): boolean {
    return (
      (estudianteNota.notaParcial1 !== notasEstudiante?.notaParcial1) ||
      (estudianteNota.notaParcial2 !== notasEstudiante?.notaParcial2) ||
      (estudianteNota.notaPractica !== notasEstudiante?.notaPractica) ||
      (estudianteNota.notaAsistencia !== notasEstudiante?.notaAsistencia)
    );
  }

  ngOnInit(): void {
    this.proConvocatoriaService.getEstadoActual().subscribe((response) => {

      const customResponse: CustomHttpResponse = response;
      
      if (!customResponse || customResponse.httpStatusCode !== 200) {
        this.noHayConvocatoria = false;
        return;
      }

      if (customResponse.mensaje !== PROFESIONALIZACION.REGISTRO_NOTAS) {
        this.noHayConvocatoria = false;
      }
    });
    
    this.noHayConvocatoria = true;
    this.cargaArchivoService.maxArchivo().subscribe({
      next: (result) => {
        this.tamMaxArchivo = result;
      },
      error: () => {
        this.showServicioNoDisponible = true;
      },
    })

    this.periododService.listar().subscribe((response) => {
      this.selectedListPeriodos = response;
    })

    this.materiasService.listar().subscribe((response) => {
      this.materiasList = response;
    })
  }

  onSelectChange() {
    this.periodoSemestreService.getAllByPeriodo(this.seletedItemPeriodo).subscribe({
      next: (result) => {
        this.selectedListSemestres = result;
        this.selectedParalelo = null;
        this.selectedListMaterias = null;
        this.estudiantesNotas = null;
        this.selectedInstructor = null;

      }
    });
  }

  onSelectChangeMateriaSemestre() {
    this.materiaSemestreService.getAllByPeriodoSemestre(this.seletedItemSemestre.codPeriodoSemestre).subscribe({
      next: (result) => {
        this.selectedListMaterias = result;
      }
    });
  }

  onSelectChangeMateriaParalelo() {
    this.proMateriaParaleloService.getAllByCodSemestreMateria(this.seletedItemMateria.codMateriaSemestre).subscribe({
      next: (result) => {
        this.paralelosList = result;
        this.selectedParalelo = null;
      }
    });
  }

  onSelectChangeParalelo() {
    this.proNotaService.listByCodEstudianteParaleloWithNotas(this.selectedParalelo.codSemestreMateriaParalelo).subscribe(
      (data) => {
        this.estudiantesNotas = data;
        this.crearFormularioNotas();
      },
      (error) => {
        console.log(error);
      }
    );

    this.proInstructorParaleloService.getAllByCodMateriaParalelo(this.selectedParalelo.codSemestreMateriaParalelo).subscribe(
      (response) => {
        if (response.length > 0) {
          this.selectedInstructor = response[0];
        } else {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'No existe un instructor asignado'
          );
        }
      },
      (error) => {
        this.selectedInstructor = null;
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          error
        );
      }
    )

    this.generalForm = this.builder.group({
      fecha: [new Date()],
      codMateriaParalelo: [this.selectedParalelo.codSemestreMateriaParalelo],
    })

    this.proNotaProfesionalizacionGeneralService.getByMateriaParalelo(this.selectedParalelo.codSemestreMateriaParalelo).subscribe(
      (response)=>{
        const observables = response?.documentos?.map(documento =>
          this.documentosService.visualizarArchivo(documento.codDocumento)
        );

        if (observables && observables.length > 0) {
          forkJoin(observables).subscribe({
            next: urls => {
              this.urlsArchivo = urls.map((url, index) => ({
                urlSafe: url,
                nombreArchivo: response?.documentos[index]?.nombre
              }));
              console.log("urlsArchivo", this.urlsArchivo);
            },
            error: err => console.log("No se pudo obtener los archivos", err)
          });
        }
      }
    )
  }

  subirArchivo(event: any): void {
    this.docNotas = [];
    let doc: File;
    let docName: string;
    // Para validar tamaño y extension pdf
    const extension = '';
    docName = event.target.files[0].name;
    for (let doc of event.target.files) {
      if (doc !== undefined) {
        if (doc.size > this.tamMaxArchivo) {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            null,
            'Archivo excede el tamaño máximo permitido'
          );
        } else if (!docName.endsWith(extension)) {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            null,
            'El archivo debe ser de tipo .pdf'
          );
        } else {
          this.docNotas.push(doc);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Archivo cargado');
        }
      }
    }

  }

  get docSoporteField() {
    return this.generalForm.get('docSoporte');
  }
}
