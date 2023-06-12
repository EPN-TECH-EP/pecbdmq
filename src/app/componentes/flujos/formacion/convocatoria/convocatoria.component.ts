import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { OPCIONES_DATEPICKER } from '../../../../util/constantes/opciones-datepicker.const';
import { Subscription, catchError, of } from 'rxjs';
import { FileUploadStatus } from '../../../../modelo/util/file-upload-status';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../../../util/alerta/alerta.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoAlerta } from '../../../../enum/tipo-alerta';
import { CustomHttpResponse } from '../../../../modelo/admin/custom-http-response';
import { Notificacion } from '../../../../util/notificacion';
import { CargaArchivoService } from '../../../../servicios/carga-archivo';
import { RequisitoService } from '../../../../servicios/requisito.service';
import { ConvocatoriaService } from '../../../../servicios/formacion/convocatoria.service';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { Requisito } from '../../../../modelo/admin/requisito';
import { Convocatoria } from '../../../../modelo/admin/convocatoria';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { ArchivoService } from '../../../../servicios/archivo.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MyValidators } from '../../../../util/validators';
import { FormacionService } from 'src/app/servicios/formacion/formacion.service';
import { FORMACION } from 'src/app/util/constantes/fomacion.const';
import { ComponenteBase } from 'src/app/util/componente-base';
import { DocumentosService } from 'src/app/servicios/formacion/documentos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.scss'],
})
export class ConvocatoriaComponent extends ComponenteBase implements OnInit {
  opcionesDatepicker = OPCIONES_DATEPICKER;
  correo: FormControl;
  convocatoriaForm: FormGroup;
  estadoArchivo: FileUploadStatus;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  documentoConvocatoria: File;
  documentoSoporte: File;
  requisitosConvocatoria: Requisito[];
  requisitoEditable: Requisito;
  requisitos: Requisito[];
  convocatorias: Convocatoria[];
  convocatoria: Convocatoria;
  archivo: File;
  urlArchivo: SafeResourceUrl;

  // verifica el estado de formación
  procesoActivo = false;
  terminaConsultaEstado = false;

  existeProcesoActivo: boolean;
  tieneEstadoConvocatoria: boolean;
  ocurrioErrorInicioProceso: boolean = false;

  estaActulizando: boolean;
  estaCreando: boolean;

  // éxito en creación de convocatoria
  exitoCreacion = false;

  @ViewChild('table') table!: MdbTableDirective<Requisito>;
  editElementIndex = -1;
  addRow = false;

  private tamMaxArchivo: number; 
  

  constructor(
    private formBuilder: FormBuilder,
    private cargaArchivoService: CargaArchivoService,
    private servicioRequisito: RequisitoService,
    private servicioConvocatoria: ConvocatoriaService,
    private archivoService: ArchivoService,
    private sanitizer: DomSanitizer,
    private formacionService: FormacionService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private documentosFormacionService: DocumentosService,
    private router: Router
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.tamMaxArchivo = 0;
    this.subscriptions = [];
    this.requisitosConvocatoria = [];
    this.estadoArchivo = new FileUploadStatus();
    this.correo = new FormControl('', [Validators.required, Validators.email]);
    this.urlArchivo = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.showLoading = false;
    this.tieneEstadoConvocatoria = false;
    this.ocurrioErrorInicioProceso = false;
    this.existeProcesoActivo = false;
    this.estaActulizando = false;
    this.estaCreando = false;    
    this.correo = new FormControl('', [Validators.required, Validators.email]);
    this.construirFormulario();
  }

  ngOnInit() {
    this.formacionService.getEstadoFormacion().pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          errorResponse
        );
        return of(null);
      })
    ).subscribe((response) => {
      const customResponse: CustomHttpResponse = response?.body;

      if (!customResponse || customResponse.httpStatusCode !== 200) {
        this.ocurrioErrorInicioProceso = true;
        return;
      }

      this.existeProcesoActivo = true;

      if (customResponse.mensaje === FORMACION.estadoConvocatoria) {
        this.tieneEstadoConvocatoria = true;
        this.estaActulizando = true;
        this.servicioConvocatoria.getConvocatoriaActiva().subscribe({
          next: (data) => {
            this.matchDatosConvocatoria(data[0]);
            this.convocatoria = data[0];
            console.log(this.convocatoria);
            this.requisitosConvocatoria = data[0].requisitos;
            this.correo.patchValue(data[0].correo);
            this.documentoConvocatoriaField.clearValidators();
            this.documentoConvocatoriaField.updateValueAndValidity();
          },
          error: (errorResponse) => {
            Notificacion.notificacion(
              this.notificationRef,
              this.notificationServiceLocal,
              errorResponse
            );
          }
        });
      }

      if (customResponse.mensaje === FORMACION.estadoInicial) {
        this.existeProcesoActivo = false;
        this.estaCreando = true;

      }
      this.servicioRequisito.getRequisito().subscribe((data) => {
        this.requisitos = data;
      });
    });

    this.subscriptions.push(
      this.cargaArchivoService.maxArchivo().subscribe({
        next: (result) => (this.tamMaxArchivo = result),
        error: (errorResponse) => console.log(errorResponse),
      })
    );
  }



  private construirFormulario() {
    this.convocatoriaForm = this.formBuilder.group(
      {
        codigo                : ['', Validators.required],
        cuposHombres          : ['', Validators.required],
        cuposMujeres          : ['', Validators.required],
        fechaInicio           : ['', Validators.required],
        fechaFin              : ['', Validators.required],
        horaInicio            : ['', Validators.required],
        horaFin               : ['', Validators.required],
        documentoConvocatoria : ['', Validators.required],
        documentoSoporte      : [''],
      },
      {
        validators: MyValidators.validDate,
      }
    );
  }

  subirArchivo(event: any, tipo: string): void {
    const extension = '.pdf';
    const archivo: File = event.target.files[0];
    if (!archivo) {
      return;
    }

    if (archivo.size > this.tamMaxArchivo) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'El archivo excede el tamaño máximo permitido.'
      );
      return;
    }

    if (!archivo.name.endsWith(extension)) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'El archivo debe tener extensión .pdf'
      );
      return;
    }

    if (tipo === 'convocatoria') {
      this.documentoConvocatoria = archivo;
    } else {
      this.documentoSoporte = archivo;
    }
  }

  agregarRequisito() {
    this.requisitosConvocatoria.push(this.requisitoEditable);
    this.editElementIndex = -1;
    this.addRow = false;
    this.requisitoEditable = new Requisito();
  }

  eliminarRequisito(index: number) {
    this.requisitosConvocatoria.splice(index, 1);
    this.editElementIndex = -1;
    this.addRow = false;
  }

  guardarConvocatoria() {

    this.showLoading = true;

    this.convocatoria = {
      ...this.convocatoria,
      codigoUnico: this.convocatoriaForm.get('codigo')?.value,
      cupoHombres: this.convocatoriaForm.get('cuposHombres')?.value,
      cupoMujeres: this.convocatoriaForm.get('cuposMujeres')?.value,
      horaInicioConvocatoria: this.convocatoriaForm.get('horaInicio')?.value,
      horaFinConvocatoria: this.convocatoriaForm.get('horaFin')?.value,
      fechaInicioConvocatoria: this.convocatoriaForm.get('fechaInicio')?.value,
      fechaFinConvocatoria: this.convocatoriaForm.get('fechaFin')?.value,
      requisitos: this.requisitosConvocatoria,
      /*documentos:
        this.documentoConvocatoria?.name + ',' + this.documentoSoporte?.name,*/
      correo: this.correo.value,
      //codConvocatoria: 1,
      estado: 'ACTIVO',
      //nombre: 'Convocatoria 1',
      //codPeriodoAcademico: 1,
      //codPeriodoEvaluacion: 1,
    };
    //console.log(this.convocatoria);

    // invocación servicio crear convocatoria
    const formData = new FormData();
    formData.append('datosConvocatoria', JSON.stringify(this.convocatoria));
    formData.append('docsConvocatoria',  this.documentoConvocatoria);
    formData.append('docsPeriodoAcademico', this.documentoSoporte);
    
    console.log(formData);

    this.subscriptions.push(
      this.servicioConvocatoria.crearConvocatoria(formData).subscribe({
        next: (response) => {
          const customResponse: CustomHttpResponse = response;
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,            
            'Convocatoria creada exitosamente'
          );

          this.exitoCreacion = true;
          this.showLoading = false;

        }, 
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
          this.showLoading = false;
        }
      })
    );    
  }

  visualizarArchivo(id: string) {
    this.archivoService.visualizar(id).subscribe(
      (url) => {
        this.urlArchivo = url;
      },
      () => {
        this.urlArchivo = null;
      }
    );
  }

  get codigoField() {
    return this.convocatoriaForm.get('codigo');
  }

  get cuposHombresField() {
    return this.convocatoriaForm.get('cuposHombres');
  }

  get cuposMujeresField() {
    return this.convocatoriaForm.get('cuposMujeres');
  }

  get fechaInicioField() {
    return this.convocatoriaForm.get('fechaInicio');
  }

  get fechaFinField() {
    return this.convocatoriaForm.get('fechaFin');
  }

  get horaInicioField() {
    return this.convocatoriaForm.get('horaInicio');
  }

  get horaFinField() {
    return this.convocatoriaForm.get('horaFin');
  }

  get documentoConvocatoriaField() {
    return this.convocatoriaForm.get('documentoConvocatoria');
  }

  private matchDatosConvocatoria(data: Convocatoria) {

    console.log(data.codigoUnico);
    data.fechaInicioConvocatoria = new Date(data.fechaInicioConvocatoria);
    console.log("fecha inicio",data.fechaInicioConvocatoria);
    data.fechaFinConvocatoria = new Date(data.fechaFinConvocatoria);

    this.convocatoriaForm.patchValue({
      codigo        : data?.codigoUnico,
      cuposHombres  : data?.cupoHombres,
      cuposMujeres  : data?.cupoMujeres,
      fechaInicio   : data?.fechaInicioConvocatoria,
      fechaFin      : data?.fechaFinConvocatoria,
      horaInicio    : data?.horaInicioConvocatoria,
      horaFin       : data?.horaFinConvocatoria,
    });
    
    console.log("datos convocatoria",this.convocatoriaForm.value);

  }

  actualizarConvocatoria() {

    this.showLoading = true;

    this.convocatoria = {
      ...this.convocatoria,
      codigoUnico             : this.convocatoriaForm.get('codigo')?.value,
      cupoHombres             : this.convocatoriaForm.get('cuposHombres')?.value,
      cupoMujeres             : this.convocatoriaForm.get('cuposMujeres')?.value,
      horaInicioConvocatoria  : this.convocatoriaForm.get('horaInicio')?.value,
      horaFinConvocatoria     : this.convocatoriaForm.get('horaFin')?.value,
      fechaInicioConvocatoria : this.convocatoriaForm.get('fechaInicio')?.value,
      fechaFinConvocatoria    : this.convocatoriaForm.get('fechaFin')?.value,
      requisitos              : this.requisitosConvocatoria,
      correo                  : this.correo.value,
      estado                  : 'ACTIVO',
    };

    console.log('Convocatoria para actualizar', this.convocatoria);

    console.log('Documento convocatoria', this.documentoConvocatoria);

    const formData = new FormData();

    if (this.documentoConvocatoriaField?.touched) {
      formData.append('datosConvocatoria', JSON.stringify(this.convocatoria));
      formData.append('docsConvocatoria', this.documentoConvocatoria);
    }

    formData.append('datosConvocatoria', JSON.stringify(this.convocatoria));
    console.log('Datos convocatoria', formData.get('datosConvocatoria'));

    this.subscriptions.push(
      this.servicioConvocatoria.actualizar(formData).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Convocatoria actualizada exitosamente'
          );

          this.exitoCreacion = true;
          this.showLoading = false;
          this.router.navigate(['/principal/formacion/proceso']);

        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
          console.log(errorResponse);
          this.showLoading = false;
        }
      })
    );

  }

  descargarDocumento(idDocumento: number) {
    console.log(idDocumento);
    if (idDocumento) {
      this.subscriptions.push(
        this.documentosFormacionService.descargar(idDocumento).subscribe({
          next: (documento: any) => {
            console.log(documento);
            const blob = new Blob([documento], {type: 'application/pdf'});
            const url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificacion(
              this.notificationRef,
              this.notificationServiceLocal,
              errorResponse
            );
          }
        })
      );
    }
  }
}
