import { Component, OnInit, ViewChild } from '@angular/core';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { PopconfirmComponent } from '../util/popconfirm/popconfirm.component';
import { AbstractControl, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { FileUploadStatus } from 'src/app/modelo/util/file-upload-status';
import { CargaArchivoService } from 'src/app/servicios/carga-archivo';
import { MdbNotificationRef, MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Notificacion } from 'src/app/util/notificacion';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { Subscription } from 'rxjs';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { Requisito } from 'src/app/modelo/requisito';
import { RequisitoService } from 'src/app/servicios/requisito.service';
import { MdbCheckboxChange } from 'mdb-angular-ui-kit/checkbox';
import { Convocatoria } from 'src/app/modelo/convocatoria';
import { ConvocatoriaService } from 'src/app/servicios/convocatoria.service';

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.scss'],
  providers: [MdbPopconfirmService],

})


export class ConvocatoriaComponent implements OnInit {
  public fileStatus = new FileUploadStatus();
  private subscriptions: Subscription[] = [];
  public showLoading: boolean;
  public fileName: string;
  public profileImage: File;


  validationForm: FormGroup;
  listaRequisitos: FormGroup;

  popconfirmRef: MdbPopconfirmRef<PopconfirmComponent> | null = null;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  convocatorias: Convocatoria [];
  convocatoria: Convocatoria;
  requisitos: Requisito[];
  requisito: Requisito;
  requisitoEditForm: Requisito;

  private maxArchivo: number = 0;
  datepicker1= '' as any;
  datepicker2= '' as any;
  timepicker1= '' as any;
  timepicker2= '' as any;

  //table
  @ViewChild('table') table!: MdbTableDirective<Requisito>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Datos de los Requerimientos'];



  constructor(
    private cargaArchivoService: CargaArchivoService,
    private notificationService: MdbNotificationService,
    private popconfirmService: MdbPopconfirmService,
    private Api: RequisitoService,
    private ApiConvocatoria: ConvocatoriaService,

    ) {
      this.subscriptions = [];
       this.requisito= {
          codigoRequisito: 0,
         codFuncionario:0,
         nombre:'',
         descripcion: '',
         esDocumento:'',
         estado: 'ACTIVO'
         }
       this.requisitoEditForm = {
        codigoRequisito: 0,
        codFuncionario:0,
       nombre:'',
         descripcion: '',
         esDocumento:'',
         estado: 'ACTIVO'
       };
       this.subscriptions = [];
       this.convocatoria = {
        codConvocatoria: 0,
        codPeriodoEvaluacion: 0,
        codPeriodoAcademico:0,
        nombre:'',
        estado: '',
        fechaInicioConvocatoria: '',
        fechaFinConvocatoria: '',
        horaInicioConvocatoria: '',
        horaFinConvocatoria: '',
        codigoUnico: 0,
        cupoHombres:0,
        cupoMujeres: 0,
            }


  this.validationForm = new FormGroup({
    codigo: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    cuposHombres: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    cuposMujeres: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
    email: new FormControl(null, { validators: Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      , updateOn: 'blur' }),
    });


  }  newRow: Requisito = {
        codigoRequisito: 0,
        codFuncionario:0,
        nombre:'',
        descripcion: '',
        esDocumento:'',
        estado: 'ACTIVO'
};

  get codigo(): AbstractControl {
    return this.validationForm.get('codigo')!;
  }
  get cuposHombres(): AbstractControl {
    return this.validationForm.get('cuposHombres')!;
  }
  get cuposMujeres(): AbstractControl {
    return this.validationForm.get('cuposMujeres')!;
  }
  get email(): AbstractControl {
    return this.validationForm.get('email')!;
  }



  addNewRow(): void {
    this.requisitos = [...this.requisitos, { ...this.newRow }];
    this.newRow.codigoRequisito = 0;
    this.newRow.codFuncionario = 0;
    this.newRow.nombre = '';
    this.newRow.descripcion = '';
    this.newRow.estado = 'ACTIVO';
    this.addRow = false;

  }


  onSubmit(): void {
    this.validationForm.markAllAsTouched();
  }



  ngOnInit(): void {
    this.Api.getRequisito().subscribe(data => {
      this.requisitos = data;
    });
    this.ApiConvocatoria.getConvocatoria().subscribe(data => {
      this.convocatorias = data;
    });


    this.subscriptions.push(
      this.cargaArchivoService.maxArchivo().subscribe({
        next: (result) => {
          this.maxArchivo = result;
        },
        error: (errorResponse) => {
          console.log(errorResponse);
        },
      })
    );
  }


  cargarArchivo() {
    if (this.profileImage !== undefined) {
      if (this.profileImage.size > this.maxArchivo) {
        this.notificacion(null, 'Archivo excede el tamaño máximo permitido')
      } else {
        const formData = new FormData();
        formData.append('nombreArchivo', this.fileName);
        formData.append('archivo', this.profileImage);

        this.subscriptions.push(
          this.cargaArchivoService.cargarArchivo(formData).subscribe({
            next: (event: HttpEvent<any>) => {
              this.reportUploadProgress(event);
            },
            error: (errorResponse) => {
              //console.log(errorResponse);

              this.notificacion(errorResponse);
              this.fileStatus.status = 'done';
            },
          })
        );
      }
    }
  }



  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(
          (5100 * event.loaded) / event.total
        );
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          //this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.notificacionOK(`Archivo cargado con éxito`);
          this.fileStatus.status = 'done';
          break;
        } else {
          this.notificacion(
            new HttpErrorResponse({ error: 'Error al cargar el archivo' }),
            `Error al cargar el archivo`
          );
          break;
        }
      default:
        `Finished all processes`;
    }
  }


  notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }




  private notificacion(errorResponse?: HttpErrorResponse, mensaje?: string) {
    //console.log(errorResponse);

    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;
    let mensajeError = 'ERROR';
    let codigoError = 0;

    if (errorResponse) {
      let customError: CustomHttpResponse = errorResponse.error;
      mensajeError = customError.mensaje;
      codigoError = errorResponse.status;
    }

    if (mensaje) {
      mensajeError = mensaje;
    }
    if (codigoError === 0) {
      mensajeError = 'Error de conexión al servidor';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
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
  public onProfileImageChange(event: any): void {
    //console.log(event.target.files[0]);

    this.fileName = event.target.files[0].name;
    this.profileImage = event.target.files[0];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }


  public registro(requisito: Requisito): void {
    requisito={...requisito, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crearRequisito(requisito).subscribe({
        next: (response: HttpResponse<Requisito>) => {
          let nuevoRequisito: Requisito = response.body;
          this.requisitos.push(nuevoRequisito);
          this.notificacionOK('Semestre creada con éxito');
          this.requisito ={
            codigoRequisito: 0,
            codFuncionario:0,
            nombre:'',
            descripcion: '',
            esDocumento:'',
            estado: 'ACTIVO'
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }
  public eliminar(codigo: number): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminarRequisito(codigo).subscribe({
        next: () => {
          this.notificacionOK('Requisito eliminado con éxito');
          this.showLoading = false;
          const index = this.requisitos.findIndex(convocatoria => convocatoria.codigoRequisito === codigo);
          this.requisitos.splice(index, 1);
          this.requisitos = [...this.requisitos]
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }

  openPopconfirm(event: Event) {
    const target = event.target as HTMLElement;
    this.popconfirmRef = this.popconfirmService.open(PopconfirmComponent, target, { popconfirmMode: 'modal' });
  }



}




