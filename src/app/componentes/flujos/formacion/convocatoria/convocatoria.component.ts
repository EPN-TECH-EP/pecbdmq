import {Component, OnInit, ViewChild} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {OPCIONES_DATEPICKER} from '../../../../util/constantes/opciones-datepicker.const';
import {FileUploadStatus} from '../../../../modelo/util/file-upload-status';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {HttpErrorResponse} from '@angular/common/http';
import {CustomHttpResponse} from '../../../../modelo/admin/custom-http-response';
import {Notificacion} from '../../../../util/notificacion';
import {CargaArchivoService} from '../../../../servicios/carga-archivo';
import {RequisitoService} from '../../../../servicios/requisito.service';
import {ConvocatoriaService} from '../../../../servicios/formacion/convocatoria.service';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {Requisito} from '../../../../modelo/admin/requisito';
import {Convocatoria} from '../../../../modelo/admin/convocatoria';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ArchivoService} from '../../../../servicios/archivo.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {MyValidators} from '../../../../util/validators';
import {FormacionService} from 'src/app/servicios/formacion/formacion.service';
import {FORMACION} from 'src/app/util/constantes/fomacion.const';
import {ComponenteBase} from 'src/app/util/componente-base';

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.scss'],
})
export class ConvocatoriaComponent extends ComponenteBase implements OnInit {
  opcionesDatepicker = OPCIONES_DATEPICKER;
  email: FormControl;
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
    private popConfirmServiceLocal: MdbPopconfirmService
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.tamMaxArchivo = 0;
    this.subscriptions = [];
    this.requisitosConvocatoria = [];
    this.estadoArchivo = new FileUploadStatus();
    this.construirFormulario();
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.urlArchivo = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.showLoading = false;
  }

  ngOnInit() {
    // verifica el estado de formación
    this.formacionService.getEstadoFormacion().subscribe({
      next: (response) => {
        const customResponse: CustomHttpResponse = response.body;
        console.log(customResponse.mensaje);
        if (customResponse.httpStatusCode === 200) {
          this.terminaConsultaEstado = true;

          if (customResponse.mensaje !== FORMACION.estado_inicial) {
            //Notificacion.notificacion(this.notificationRef, this.notificationService, null, 'Ya existe una convocatoria activa.');
            this.procesoActivo = true;
            this.servicioConvocatoria.getConvocatoria().subscribe((data) => {
              this.convocatorias = data;
              console.log(this.convocatorias);
            });
          } else {
            this.procesoActivo = false;

            // solo si el proceso de formación no está activo ingresa a la creación de la convocatoria
            this.servicioRequisito.getRequisito().subscribe((data) => {
              this.requisitos = data;
            });

            this.servicioConvocatoria.getConvocatoria().subscribe((data) => {
              this.convocatorias = data;
              console.log(this.convocatorias);
            });

            this.subscriptions.push(
              this.cargaArchivoService.maxArchivo().subscribe({
                next: (result) => (this.tamMaxArchivo = result),
                error: (errorResponse) => console.log(errorResponse),
              })
            );
          }
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          errorResponse
        );
      },
    });
  }


  private construirFormulario() {
    this.convocatoriaForm = this.formBuilder.group(
      {
        codigo                : ['', [Validators.required, Validators.maxLength(10)]],
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
      correo: this.email.value,
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
    formData.append('docsConvocatoria', this.documentoConvocatoria);
    formData.append('docsPeriodoAcademico', this.documentoSoporte);

    console.log(formData);

    this.subscriptions.push(
      this.servicioConvocatoria.crearConvocatoria(formData).subscribe({
        next: () => {
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

  get codigo() {
    return this.convocatoriaForm.get('codigo');
  }

  get cuposHombres() {
    return this.convocatoriaForm.get('cuposHombres');
  }

  get cuposMujeres() {
    return this.convocatoriaForm.get('cuposMujeres');
  }

  get fechaInicio() {
    return this.convocatoriaForm.get('fechaInicio');
  }

  get fechaFin() {
    return this.convocatoriaForm.get('fechaFin');
  }

  get horaInicio() {
    return this.convocatoriaForm.get('horaInicio');
  }

  get horaFin() {
    return this.convocatoriaForm.get('horaFin');
  }

  get documentoConvocatoriaForm() {
    return this.convocatoriaForm.get('documentoConvocatoria');
  }
}
