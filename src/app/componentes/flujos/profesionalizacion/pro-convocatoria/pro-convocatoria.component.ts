import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import {OPCIONES_DATEPICKER} from '../../../../util/constantes/opciones-datepicker.const';
import {MdbNotificationRef, MdbNotificationService,} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {HttpErrorResponse} from '@angular/common/http';
import {CustomHttpResponse} from '../../../../modelo/admin/custom-http-response';
import {Notificacion} from '../../../../util/notificacion';
import {RequisitoService} from '../../../../servicios/requisito.service';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {Requisito} from '../../../../modelo/admin/requisito';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ArchivoService} from '../../../../servicios/archivo.service';
import {MyValidators} from '../../../../util/validators';
import {FormacionService} from '../../../../servicios/formacion/formacion.service';
import {PROFESIONALIZACION} from '../../../../util/constantes/profesionalizacion.const';
import {ComponenteBase} from '../../../../util/componente-base';
import {catchError, finalize} from 'rxjs/operators';
import {forkJoin, from, of, switchMap} from 'rxjs';
import {DocumentosService} from '../../../../servicios/formacion/documentos.service';
import {Router} from '@angular/router';
import {ProConvocatoriaService} from '../../../../servicios/profesionalizacion/pro-convocatoria.service';
import {Semestre} from '../../../../modelo/admin/semestre';
import {ParametroService} from '../../../../servicios/parametro.service';
import {Parametro} from '../../../../modelo/admin/parametro';
import {ProConvocatoria} from '../../../../modelo/admin/pro-convocatoria';
import {ConvocatoriaService} from '../../../../servicios/formacion/convocatoria.service';
import {
  ProRequisitoConvocatoriaService
} from '../../../../servicios/profesionalizacion/pro-requisito-convocatoria.service';
import {ProSemestreService} from '../../../../servicios/profesionalizacion/pro-semestre.service';
import {ProRequisitoConvocatoria} from '../../../../modelo/admin/pro-requisito-convocatoria';
import {ProPeriodoService} from "../../../../servicios/profesionalizacion/pro-periodo.service";
import {ProPeriodo} from "../../../../modelo/admin/profesionalizacion/pro-periodo";

function validateEmailList(control) {
  const emailList = control.value.split(','); // Divide la cadena en una lista de correos electrónicos

  // Expresión regular para validar un correo electrónico
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Itera a través de la lista de correos electrónicos y verifica cada uno
  const isValid = emailList.every(email => emailPattern.test(email.trim()));

  return isValid ? null : { invalidEmailList: true };
}
@Component({
  selector: 'app-convocatoria',
  templateUrl: './pro-convocatoria.component.html',
  styleUrls: ['./pro-convocatoria.component.scss'],
})

export class ProConvocatoriaComponent extends ComponenteBase implements OnInit {
  public parametros: Parametro[];
  opcionesDatepicker = OPCIONES_DATEPICKER;
  correo: FormControl;
  form: FormGroup;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  requisitosConvocatoria: Requisito[] = [];
  requisitosConvocatoriaOriginal: ProRequisitoConvocatoria[] = [];
  itemRequisito: Requisito;
  semestreList: Semestre[];
  requisitos: Requisito[];
  requisitosLista: Requisito[];
  convocatoria: ProConvocatoria;
  fechaActual: Date;
  codigoUnicoConvocatoria: string;
  nombrePeriodo: string;
  minDate: Date;
  existeProcesoActivo: boolean;
  tieneEstadoConvocatoria: boolean;
  ocurrioErrorInicioProceso: boolean;
  estaCreando: boolean;
  estaEditandoOCreando: boolean;
  seCreoConExito = false;
  periodos: ProPeriodo[];

  @ViewChild('table') table!: MdbTableDirective<Requisito>;
  editElementIndex = -1;
  addRow = false;
  public selectedData: {
    semestre?: Semestre,
    msj1?: Parametro
    msj2?: Parametro
  } = {};

  constructor(
    private archivoService: ArchivoService,
    private proConvocatoriaService: ProConvocatoriaService,
    private proRequisitoConvocatoriaService: ProRequisitoConvocatoriaService,
    private convocatoriaService: ConvocatoriaService,
    private documentosFormacionService: DocumentosService,
    private formBuilder: FormBuilder,
    private formacionService: FormacionService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private parametroService: ParametroService,
    private router: Router,
    private semestreService: ProSemestreService,
    private servicioRequisito: RequisitoService,
    private proPeriodoService: ProPeriodoService
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.itemRequisito = new Requisito()
    this.subscriptions = [];
    this.showLoading = false;
    this.tieneEstadoConvocatoria = false;
    this.ocurrioErrorInicioProceso = false;
    this.existeProcesoActivo = false;
    this.estaCreando = false;
    this.estaEditandoOCreando = false;
    this.correo = new FormControl('', [Validators.required, validateEmailList]);
    this.construirFormulario();
    this.getSemestres();
    this.getParametros();
    this.fechaActual = new Date();

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 1);

    this.codigoUnicoConvocatoria = '';
    this.nombrePeriodo = '';
  }

  ngOnInit() {

    this.servicioRequisito.getRequisito().pipe(
      switchMap((requisitos) => {
        this.requisitos = requisitos;
        this.requisitosLista = requisitos;
        return this.proPeriodoService.getByEstado("ACTIVO");
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        return of(null);
      }),
    ).pipe(switchMap((periodos) => {
        this.periodos = periodos;
        return this.proConvocatoriaService.getEstadoActual();
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        return of(null);
      }),).subscribe((response) => {

      const customResponse: CustomHttpResponse = response;

      if (!customResponse || customResponse.httpStatusCode !== 200) {
        this.ocurrioErrorInicioProceso = true;
        return;
      }

      this.existeProcesoActivo = true;

      if (customResponse.mensaje === PROFESIONALIZACION.ACTIVO) {
        this.tieneEstadoConvocatoria = true;
        this.estaCreando = false;
        this.estaEditandoOCreando = true;
        this.proConvocatoriaService.getConvocatoriaActiva().subscribe({
          next: (convocatoria) => {
            if (!convocatoria) {
              this.handleNotFoundConvocatoria();
              return;
            }
            this.estaCreando = false;
            this.matchDatosConvocatoriaFormulario(convocatoria);
            this.codigoUnicoConvocatoria = convocatoria.codigoUnicoConvocatoria;
            this.filtrarRequisitosConvocatoria(convocatoria);
            if (this.minDate > new Date(convocatoria.fechaActual)) {
              this.minDate = new Date(convocatoria.fechaActual);
            }

            this.fechaActual = convocatoria.fechaActual;
            this.convocatoria = convocatoria;
            this.correo.patchValue(convocatoria.correo);
          },
          error: (errorResponse) => {
            this.handleNotFoundConvocatoria();
            Notificacion.notificacion(
              this.notificationRef,
              this.notificationServiceLocal,
              errorResponse
            );
          }
        });
      }

      if (customResponse.mensaje === PROFESIONALIZACION.SIN_PERIODO || customResponse.mensaje === PROFESIONALIZACION.INACTIVO) this.handleNotFoundConvocatoria();
    });
  }

  private construirFormulario() {
    this.form = this.formBuilder.group(
      {
        nombre: ['', Validators.required],
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
        semestre: [null],
        codigoParametro: ['', Validators.required],
        codigoParametro2: ['', Validators.required],
        codPeriodo: ['', Validators.required],
      },
      {
        validators: MyValidators.validDate,
      }
    );
  }

  private matchDatosConvocatoriaFormulario(convocatoria: ProConvocatoria) {

    const fechaInicioOriginal = new Date(convocatoria.fechaInicio);
    const fechaFinOriginal = new Date(convocatoria.fechaFin);
    fechaInicioOriginal.setMinutes(fechaInicioOriginal.getMinutes() + fechaInicioOriginal.getTimezoneOffset());
    fechaFinOriginal.setMinutes(fechaFinOriginal.getMinutes() + fechaFinOriginal.getTimezoneOffset());

    convocatoria.fechaInicio = fechaInicioOriginal;
    convocatoria.fechaFin = fechaFinOriginal;

    this.onDataSelectChange(convocatoria.codigoParametro, 'msj1');
    this.onDataSelectChange(convocatoria.codigoParametro2, 'msj2');

    this.form.patchValue({
      codigoParametro: convocatoria?.codigoParametro,
      codigoParametro2: convocatoria?.codigoParametro2,
      fechaFin: convocatoria?.fechaFin,
      fechaInicio: convocatoria?.fechaInicio,
      nombre: convocatoria?.nombre,
      semestre: convocatoria?.codigoSemestre,
      codPeriodo: convocatoria?.codPeriodo
    });

  }

  private filtrarRequisitosConvocatoria(convocatoria: ProConvocatoria) {
    this.proRequisitoConvocatoriaService.listarByConvocatoria(convocatoria.codigo).subscribe(resp => {
      this.requisitos.forEach(requisito => {
        const match = resp.find(item => item.codigoRequisito === requisito.codigoRequisito);
        if (match) {
          this.requisitosConvocatoria.push(requisito);
          this.requisitosConvocatoriaOriginal.push(match);
        }
      });
    });
  }

  agregarRequisito() {
    this.requisitosConvocatoria.push(this.itemRequisito);
    this.requisitosConvocatoria.sort((a, b) => a.nombre.localeCompare(b.nombre));

    this.requisitosLista = this.requisitosLista.filter((requisito) => requisito.codigoRequisito !== this.itemRequisito.codigoRequisito);
    this.requisitosLista = [...this.requisitosLista];

    this.editElementIndex = -1;
    this.addRow = false;
    this.itemRequisito = new Requisito();
  }

  eliminarRequisito(codRequisito: number) {
    this.requisitosConvocatoria = this.requisitosConvocatoria.filter((req) => req.codigoRequisito !== codRequisito);
    this.requisitosConvocatoria = [...this.requisitosConvocatoria];

    const requisito = this.requisitos.find((r) => r.codigoRequisito === codRequisito);
    this.requisitosLista.push(requisito);

    this.requisitosLista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    this.requisitosLista = [...this.requisitosLista];

  }

  crearConvocatoria() {
    console.log(this.selectedData)

    this.showLoading = true;

    this.convocatoria = {
      ...this.convocatoria,
      nombre: this.form.get('nombre')?.value,
      codigoParametro: this.form.get('codigoParametro')?.value,
      codigoParametro2: this.form.get('codigoParametro2')?.value,
      codigoSemestre: this.form.get('semestre')?.value,
      codPeriodo: this.form.get('codPeriodo')?.value,
      fechaInicio: this.form.get('fechaInicio')?.value,
      fechaFin: this.form.get('fechaFin')?.value,
      correo: this.correo.value,
      fechaActual: this.fechaActual,
      codigoUnicoConvocatoria: this.codigoUnicoConvocatoria,
      estado: 'ACTIVO',
    };

    this.subscriptions.push(
      this.proConvocatoriaService.crear(this.convocatoria).subscribe({
        next: (response: ProConvocatoria) => {
          this.createRequirements(response);
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Convocatoria creada exitosamente'
          );
          this.seCreoConExito = true;
          this.showLoading = false;
          this.router.navigate(['/principal/profesionalizacion/menu-convocatoria']);

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

  get nombreField() {
    return this.form.get('nombre');
  }

  get fechaInicioField() {
    return this.form.get('fechaInicio');
  }

  get fechaFinField() {
    return this.form.get('fechaFin');
  }

  get codPeriodo() {
    return this.form.get('codPeriodo');
  }

  actualizarConvocatoria() {

    this.showLoading = true;

    this.convocatoria = {
      ...this.convocatoria,
      nombre: this.form.get('nombre')?.value,
      codigoParametro: this.form.get('codigoParametro')?.value,
      codigoParametro2: this.form.get('codigoParametro2')?.value,
      codigoSemestre: this.form.get('semestre')?.value,
      codPeriodo: this.form.get('codPeriodo')?.value,
      fechaInicio: this.form.get('fechaInicio')?.value,
      fechaFin: this.form.get('fechaFin')?.value,
      requisitos: this.requisitosConvocatoria,
      correo: this.correo.value,
      fechaActual: this.fechaActual,
      codigoUnicoConvocatoria: this.codigoUnicoConvocatoria,
      estado: 'ACTIVO',
    };

    this.subscriptions.push(
      this.proConvocatoriaService.actualizar(this.convocatoria).subscribe({
        next: () => {
          this.updateRequirements();
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

  findItemById(list: any[], id: any): any {
    return list.find(item => item.codParametro === id);
  }

  onDataSelectChange(id: any, field: string) {
    this.selectedData[field] = this.findItemById(this.parametros, id);
  }

  onSelectSemestre(id: any) {
    this.selectedData.semestre = this.findItemById(this.semestreList, id);
  }

  private getSemestres() {
    this.semestreService.getSemestre().subscribe(resp => this.semestreList = resp);
  }

  private getParametros() {
    this.parametroService.get().subscribe(resp => this.parametros = resp);
  }

  private handleNotFoundConvocatoria() {
    this.existeProcesoActivo = false;
    this.estaCreando = true;
    this.estaEditandoOCreando = true;

    this.proConvocatoriaService.getCodigoUnicoCreacion().subscribe(
      (codigoUnico) => {
        console.log('Codigo unico:', codigoUnico);
        this.codigoUnicoConvocatoria = codigoUnico;
      }
    )
  }

  private createRequirements(response: ProConvocatoria) {
    const requests = this.requisitosConvocatoria.map(req => {
      return this.proRequisitoConvocatoriaService.crear({
        estado: 'ACTIVO',
        codigoRequisito: req.codigoRequisito,
        codigoConvocatoria: response.codigo,
      });
    });

    forkJoin(requests)
      .pipe(finalize(() => this.reloadPage()))
      .subscribe(responses => {
      });
  }

  private reloadPage() {
    window.location.reload();
  }

  private updateRequirements() {
    const createRequests = this.requisitosConvocatoria
      .filter(aggElement => !this.requisitosConvocatoriaOriginal.some(original => original.codigoRequisito === aggElement.codigoRequisito))
      .map(aggElement =>
        this.proRequisitoConvocatoriaService.crear({
          estado: 'ACTIVO',
          codigoRequisito: aggElement.codigoRequisito,
          codigoConvocatoria: this.convocatoria.codigo,
        })
      );

    const deleteRequests = this.requisitosConvocatoriaOriginal
      .filter(original => !this.requisitosConvocatoria.some(agregado => agregado.codigoRequisito === original.codigoRequisito))
      .map(original => this.proRequisitoConvocatoriaService.eliminar(original.codigo));

    if (createRequests.length === 0 && deleteRequests.length === 0) {
      this.successUpdated();
      return;
    }

    forkJoin([...createRequests, ...deleteRequests])
      .subscribe({
        next: (responses) => {
          this.successUpdated();
        },
        error: (error) => {
          this.showLoading = false;
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Ocurrió un error al actualizar los requerimientos'
          );
          console.log(error);
        },
      });
  }

  private successUpdated() {
    Notificacion.notificacionOK(
      this.notificationRef,
      this.notificationServiceLocal,
      'Convocatoria actualizada exitosamente'
    );
    this.seCreoConExito = true;
    this.showLoading = false;
    this.reloadPage();
  }

  fijarNombreCohorte() {
    this.nombrePeriodo = this.periodos.find(periodo => periodo.codigoPeriodo === this.form.get('codPeriodo').value).nombrePeriodo;
  }

}
