import {ParaleloService} from "../../servicios/paralelo.service";
import {Paralelo} from "../../modelo/admin/paralelo";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Component, OnInit, OnDestroy} from '@angular/core';
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {Notificacion} from "../../util/notificacion";
import {ViewChild} from '@angular/core';
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {AlertaComponent} from "../util/alerta/alerta.component";
import {ComponenteBase} from "src/app/util/componente-base";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {ValidacionUtil} from "src/app/util/validacion-util";

@Component({
  selector: 'app-paralelo',
  templateUrl: './paralelo.component.html',
  styleUrls: ['./paralelo.component.scss']
})
export class ParaleloComponent extends ComponenteBase implements OnInit {

  paralelos: Paralelo[];
  paralelo: Paralelo;
  paraleloEdit: Paralelo;
  notificationRef: MdbNotificationRef<AlertaComponent> | null;
  codigo: number;
  showLoading = false;
  validacionUtil = ValidacionUtil;

  @ViewChild('table') table!: MdbTableDirective<Paralelo>;
  addRow = false;
  headers = [
    'Nombre Paralelo',
  ];

  estaEditando = false;
  codigoParaleloEditando = 0;


  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private paraleloService: ParaleloService
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.paralelos = [];
    this.subscriptions = [];
    this.notificationRef = null;
    this.paralelo = {
      codParalelo: 0,
      nombreParalelo: '',
      estado: 'ACTIVO'
    }
    this.paraleloEdit = {
      codParalelo: 0,
      nombreParalelo: '',
      estado: 'ACTIVO'
    }
  }

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros(): void {
    this.paraleloService.getParalelos().subscribe(paralelos => {
      this.paralelos = paralelos;
    });
  }

  editRow(paralelo: Paralelo) {
    this.paraleloEdit = {...paralelo}
    this.codigoParaleloEditando = paralelo.codParalelo;
  }

  undoRow() {
    this.estaEditando = false;
    this.paraleloEdit = {
      codParalelo: 0,
      nombreParalelo: '',
      estado: 'ACTIVO'
    };
  }

  crear(paralelo: Paralelo): void {

    if (paralelo.nombreParalelo == '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Ingrese un nombre de paralelo');
      return;
    }

    paralelo = {...paralelo, estado: 'ACTIVO'}
    this.showLoading = true;
    this.subscriptions.push(
      this.paraleloService.registroParalelo(paralelo).subscribe({
        next: (response: HttpResponse<Paralelo>) => {
          let nuevoParalelo: Paralelo = response.body;
          this.paralelos.push(nuevoParalelo);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Paralelo creado con éxito');

          this.showLoading = false;
          this.paralelo = {
            codParalelo: 0,
            nombreParalelo: '',
            estado: '',
          }
          this.cargarRegistros();
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          //  this.showLoading = false;
        },
      })
    );
  }

  actualizar(paralelo: Paralelo): void {

    if (this.paraleloEdit.nombreParalelo == '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Ingrese un nombre de paralelo');
      return;
    }

    paralelo = {...paralelo, estado: 'ACTIVO', nombreParalelo: this.paraleloEdit.nombreParalelo}
    this.showLoading = true;
    this.subscriptions.push(
      this.paraleloService.actualizarParalelo(paralelo, paralelo.codParalelo).subscribe({
          next: () => {
            let index = this.paralelos.findIndex(value => value.codParalelo === paralelo.codParalelo);
            this.paralelos[index] = paralelo;
            this.paralelos = [...this.paralelos];
            this.codigoParaleloEditando = 0;
            this.estaEditando = false;
            Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Paralelo actualizado con éxito');
          },

          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          },
        }
      )
    );
  }

  confirmarEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.paraleloService.eliminarParalelo(this.codigo).subscribe({
        next: () => {
          this.showLoading = false;
          const index = this.paralelos.findIndex(paraleloO => paraleloO.codParalelo === this.codigo);
          this.paralelos.splice(index, 1);
          this.paralelos = [...this.paralelos];
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Paralelo eliminado con éxito');
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}





















