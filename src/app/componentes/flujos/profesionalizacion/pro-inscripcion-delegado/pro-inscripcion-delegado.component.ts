import {Component, OnInit, ViewChild} from '@angular/core';
import {MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {ValidacionUtil} from '../../../../util/validacion-util';
import {FormBuilder} from '@angular/forms';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {Notificacion} from '../../../../util/notificacion';
import {HttpErrorResponse} from '@angular/common/http';
import {ComponenteBase} from '../../../../util/componente-base';
import {ProInscripcionService} from '../../../../servicios/profesionalizacion/pro-inscripcion.service';
import {ProInscripcion} from '../../../../modelo/admin/profesionalizacion/pro-inscripcion';
import {ProDelegadoService} from '../../../../servicios/profesionalizacion/pro-delegado.service';
import {ProDelegadoDto} from '../../../../modelo/flujos/profesionalizacion/pro-delegado-dto';
import {ProInscripcionDelegadoService} from '../../../../servicios/profesionalizacion/pro-inscripcion-delegado.service';
import {ProInscripcionDelegado} from '../../../../modelo/admin/profesionalizacion/pro-inscripcion-delegado';
import {ProConvocatoria} from '../../../../modelo/admin/pro-convocatoria';
import {get} from 'lodash';
import {ProConvocatoriaService} from '../../../../servicios/profesionalizacion/pro-convocatoria.service';
import {of, switchMap} from 'rxjs';
import {catchError, debounceTime} from 'rxjs/operators';
import {ProInscripcionDto} from '../../../../modelo/admin/pro-inscripcion-dto';

@Component({
  selector: 'app-pro-inscripcion-delegado',
  templateUrl: './pro-inscripcion-delegado.component.html',
  styleUrls: ['./pro-inscripcion-delegado.component.scss']
})
export class ProInscripcionDelegadoComponent extends ComponenteBase implements OnInit {
  inscripciones: ProInscripcionDto[];
  delegadosList: ProDelegadoDto[];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  validacionUtil = ValidacionUtil;
  inscripcionDelegadosList: ProInscripcionDelegado[];
  List: ProDelegadoDto[];
  @ViewChild('table') table!: MdbTableDirective<ProInscripcion>;
  headers = [
    'Nombre',
    'Cédula',
    'Correo',
    'Delegado',
  ];
  selectedConvocatoria: ProConvocatoria;
  convocatorias: ProConvocatoria[];

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private inscripcionService: ProInscripcionService,
    private builder: FormBuilder,
    private proDelegadoService: ProDelegadoService,
    private proInscripcionDelegadoService: ProInscripcionDelegadoService,
    private proConvocatoria: ProConvocatoriaService,
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);
    this.showLoading = false;
    this.inscripciones = [];
    this.subscriptions = [];
    this.getConvocatorias();
  }

  obtenerValorParaSelect(inscripcion: ProInscripcion): any {
    const inscripcionDelegado = this.inscripcionDelegadosList?.find(
      (delegado) => delegado.codInscripciones === inscripcion.codInscripcion
    );
    return inscripcionDelegado ? inscripcionDelegado.codDelegados : null;
  }

  ngOnInit(): void {
    this.proDelegadoService.getlistarAsignados().subscribe(resp => this.delegadosList = resp);
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  actualizar(inscripcionDelegado: ProInscripcionDelegado): void {
    const registro = this.inscripcionDelegadosList.find(ins => ins.codInscripciones === inscripcionDelegado.codInscripciones);
    inscripcionDelegado.codInscripcionesDelegados = get(registro, 'codInscripcionesDelegados', 0)
    this.subscriptions.push(
      this.proInscripcionDelegadoService
        .actualizar(inscripcionDelegado)
        .subscribe({
          next: (resp) => {
            console.log(resp)
          },
          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificacion(
              this.notificationRef,
              this.notificationServiceLocal,
              errorResponse
            );
          },
        })
    );
  }

  onchangeInscripcionSelect(event: any, inscripcion: ProInscripcion) {
    const codDelegado = event.value;
    const request: ProInscripcionDelegado = {
      estado: 'ACTIVO',
      codInscripciones: inscripcion.codInscripcion,
      codDelegados: codDelegado,
    }

    of(1)
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.proInscripcionDelegadoService.crear(request).subscribe({
          next: (resp) => {
            Notificacion.notificacionOK(
              this.notificationRef,
              this.notificationServiceLocal,
              'Delegado asignado'
            );
          },
          error: (error) => {
            if (error?.error?.mensaje === 'El registro con esa información ya existe') {
              this.actualizar(request)
              return;
            }
          },
        });
      });
  }


  onSelectConvocatoriaChange() {
    this.inscripcionService.listByConvocatoria(this.selectedConvocatoria.codigo).pipe(
      switchMap((resp) => {
        this.inscripciones = resp
        return this.proInscripcionDelegadoService.listByConvocatoria(this.selectedConvocatoria.codigo);
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        return of(null);
      })
    ).subscribe((resp) => {
      this.inscripcionDelegadosList = resp;
    });
  }

  private getConvocatorias() {
    this.proConvocatoria.listar().subscribe(resp => {
      this.convocatorias = resp;
    })
  }
}
