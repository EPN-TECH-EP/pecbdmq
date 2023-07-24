import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from "mdb-angular-ui-kit/modal";
import { NotaDisciplina } from "../../../../../modelo/flujos/Estudiante";
import { TipoFaltaService } from "../../../../../servicios/tipo-falta.service";
import { TipoBaja } from "../../../../../modelo/admin/tipo_baja";
import { ITipoFalta } from "../../../../../modelo/admin/tipo_falta";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EstudianteService, FaltaEstudiante } from "../../../../../servicios/formacion/estudiante.service";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { Notificacion } from "../../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { InstructorService } from "../../../../../servicios/formacion/instructor.service";
import { UsuarioService } from "../../../../../servicios/usuario.service";
import { switchMap } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AutenticacionService } from "../../../../../servicios/autenticacion.service";

@Component({
  selector: 'app-modal-sansion',
  templateUrl: './modal-sansion.component.html',
  styleUrls: ['./modal-sansion.component.scss']
})
export class ModalSansionComponent implements OnInit {

  estudiante: NotaDisciplina;
  faltas: ITipoFalta[];
  documentoFalta: File;
  faltasPorEstudiante: FaltaEstudiante[];
  sancionForm: FormGroup;
  estaCreandoFalta: boolean;
  headers: {key: string, label: string}[];
  esInstructor: boolean;

  constructor(
    public modalRef: MdbModalRef<ModalSansionComponent>,
    private faltaService: TipoFaltaService,
    private builder: FormBuilder,
    private estudianteService: EstudianteService,
    private ns: MdbNotificationService,
    private instructorService: InstructorService,
    private authService: AutenticacionService,
  ) {
    this.headers = [
      { key: 'sancion', label: 'Sanción' },
      { key: 'nombre', label: 'Observaciones' },
    ];
    this.estaCreandoFalta = false;
    this.esInstructor = false;
    this.estudiante = null;
    this.faltas = [];
    this.faltasPorEstudiante = [];
    this.sancionForm = new FormGroup({});
    this.documentoFalta = null;
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.faltaService.getTiposFalta().subscribe({
      next: (data) => {
        this.faltas = data;
      }
    })
    this.estudianteService.listarFaltasPorEstudiante(this.estudiante.codEstudiante).subscribe({
      next: (data) => {
        this.faltasPorEstudiante = data;
      }
    });

    this.authService.user$.pipe(
      switchMap(user => this.instructorService.getInstructorById(user.codUsuario)),
      tap(
        instructor => {
          if (instructor) {
            this.esInstructor = true;
            console.log('es instructor')
            this.sancionForm.get('codInstructor')?.setValue(instructor.codInstructor);
          }
        })
    ).subscribe({
      error: err => {
        this.esInstructor = false;
        this.mostrarNotificacion('No es usuario instructor, por lo que no puede Sancionar a un estudiante', TipoAlerta.ALERTA_ERROR)
        console.log(err);
      }
    });

  }

  private construirFormulario() {
    this.sancionForm = this.builder.group({
      codFaltaPeriodo: ['', Validators.required],
      observacionSancion: ['', Validators.required],
      archivo: ['', Validators.required],
      codInstructor: ['', Validators.required]
    });

    this.sancionForm.valueChanges.subscribe({
      next: (data) => {
        console.log(data);
      }
    });
  }

  private mostrarNotificacion(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
  }

  private guardarFalta(formData: FormData) {
    this.estudianteService.sancionarEstudiante(formData)
      .pipe(
        switchMap(() => this.estudianteService.listarFaltasPorEstudiante(this.estudiante.codEstudiante)),
        tap((data) => {
          this.faltasPorEstudiante = data;
          this.faltasPorEstudiante = [...this.faltasPorEstudiante];
          this.mostrarNotificacion('Se ha guardado la sanción correctamente', TipoAlerta.ALERTA_OK);
          this.modalRef.close();
        }),
        catchError((err) => {
          this.mostrarNotificacion('Ha ocurrido un error al guardar la sanción', TipoAlerta.ALERTA_ERROR);
          console.log('Error:', err);
          throw err;
        })
      )
      .subscribe();
  }

  onFileChange($event: Event) {
    const target = $event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.documentoFalta = files[0];
  }

  onGuardarFalta() {
    const codFaltaPeriodo = this.sancionForm.get('codFaltaPeriodo')?.value;
    const observacion = this.sancionForm.get('observacionSancion')?.value;
    const codInstructor = this.sancionForm.get('codInstructor')?.value;

    if (!codFaltaPeriodo || !observacion || this.documentoFalta === null) {
      this.mostrarNotificacion('Debe llenar todos los campos', TipoAlerta.ALERTA_ERROR);
      return;
    }

    const sancion = {
      codEstudiante: this.estudiante.codEstudiante,
      observacionSancion: observacion,
      codInstructor: codInstructor,
      codFaltaPeriodo: codFaltaPeriodo,
    };

    const formData = new FormData();
    formData.append('codEstudiante', sancion.codEstudiante.toString());
    formData.append('observacionSancion', sancion.observacionSancion);
    formData.append('codInstructor', sancion.codInstructor.toString());
    formData.append('codFaltaPeriodo', sancion.codFaltaPeriodo.toString());
    formData.append('archivo', this.documentoFalta);

    this.guardarFalta(formData);

  }
}
