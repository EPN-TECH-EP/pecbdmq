import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OPCIONES_DATEPICKER} from "../../../../util/constantes/opciones-datepicker.const";
import {Subscription} from "rxjs";
import {FileUploadStatus} from "../../../../modelo/util/file-upload-status";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../../../util/alerta/alerta.component";
import {HttpErrorResponse} from "@angular/common/http";
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {CustomHttpResponse} from "../../../../modelo/admin/custom-http-response";
import {Notificacion} from "../../../../util/notificacion";
import {CargaArchivoService} from "../../../../servicios/carga-archivo";
import {RequisitoService} from "../../../../servicios/requisito.service";
import {ConvocatoriaService} from "../../../../servicios/convocatoria.service";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {Requisito} from "../../../../modelo/admin/requisito";
import {Convocatoria} from "../../../../modelo/admin/convocatoria";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {ArchivoService} from "../../../../servicios/archivo.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.scss']
})
export class ConvocatoriaComponent implements OnInit {

  opcionesDatepicker = OPCIONES_DATEPICKER;
  email                   : FormControl;
  convocatoriaForm        : FormGroup;
  estadoArchivo           : FileUploadStatus;
  notificationRef         : MdbNotificationRef<AlertaComponent> | null = null;
  documentoConvocatoria   : File;
  documentoSoporte        : File;
  requisitosConvocatoria  : Requisito[];
  requisitoEditable       : Requisito;
  requisitos              : Requisito[];
  convocatorias           : Convocatoria[];
  convocatoria            : Convocatoria;
  archivo                 : File;
  urlArchivo              : SafeResourceUrl;

  @ViewChild('table') table!: MdbTableDirective<Requisito>;
  editElementIndex = -1;
  addRow = false;

  private tamMaxArchivo: number;
  private subscriptions: Subscription[];

  constructor(
    private formBuilder           : FormBuilder,
    private cargaArchivoService   : CargaArchivoService,
    private notificationService   : MdbNotificationService,
    private popConfirmService     : MdbPopconfirmService,
    private servicioRequisito     : RequisitoService,
    private servicioConvocatoria  : ConvocatoriaService,
    private archivoService        : ArchivoService,
    private sanitizer             : DomSanitizer,
  ) {
    this.tamMaxArchivo = 0;
    this.subscriptions = [];
    this.requisitosConvocatoria = [];
    this.estadoArchivo = new FileUploadStatus();
    this.construirFormulario();
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.urlArchivo = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }


  ngOnInit() {

    this.visualizarArchivo('245')

    this.servicioRequisito.getRequisito().subscribe(data => {
      this.requisitos = data;
    });

    this.servicioConvocatoria.getConvocatoria().subscribe(data => {
      this.convocatorias = data;
    });

    this.subscriptions.push(
      this.cargaArchivoService.maxArchivo().subscribe({
        next: (result) => this.tamMaxArchivo = result,
        error: (errorResponse) => console.log(errorResponse),
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private construirFormulario() {
    this.convocatoriaForm = this.formBuilder.group({
      codigo                : ['', [Validators.required, Validators.maxLength(10)]],
      cuposHombres          : ['', Validators.required],
      cuposMujeres          : ['', Validators.required],
      fechaInicio           : ['', Validators.required],
      fechaFin              : ['', Validators.required],
      horaInicio            : ['', Validators.required],
      horaFin               : ['', Validators.required],
      documentoConvocatoria : ['', Validators.required],
      documentoSoporte      : [''],
    });
  }

  private notificar(errorResponse?: HttpErrorResponse, mensaje?: string) {
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;
    let mensajeError = 'ERROR';
    let codigoError = 0;

    if (errorResponse) {
      const customError: CustomHttpResponse = errorResponse.error;
      mensajeError = customError.mensaje;
      codigoError = errorResponse.status;
    }

    if (mensaje) {
      mensajeError = mensaje;
    }

    if (!mensajeError) {
      mensajeError = 'Error inesperado: ' + codigoError;
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }

  subirArchivo(event: any, tipo: string): void {
    const extension = '.pdf';
    const archivo: File = event.target.files[0];
    if (!archivo) {
      return;
    }

    if (archivo.size > this.tamMaxArchivo) {
      this.notificar(null, 'El archivo excede el tamaño máximo permitido.');
      return;
    }

    if (!archivo.name.endsWith(extension)) {
      this.notificar(null, 'El archivo debe tener extensión .pdf');
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
      documentos              : this.documentoConvocatoria?.name + ',' + this.documentoSoporte?.name,
      correo                  : this.email.value,
      codConvocatoria         : 1,
      estado                  : 'Activo',
      nombre                  : 'Convocatoria 1',
      codPeriodoAcademico     : 1,
      codPeriodoEvaluacion    : 1,
    }
    console.log("la convocatoria es:", this.convocatoria);
  }

  visualizarArchivo(id: string) {
    this.archivoService.visualizar(id).subscribe(
      (url) => {
        this.urlArchivo = (url);
      },
      () => {
        this.urlArchivo = null;
      })
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
