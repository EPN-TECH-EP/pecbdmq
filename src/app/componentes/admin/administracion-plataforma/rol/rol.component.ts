import {Component, OnInit, ViewChild} from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {Rol} from 'src/app/modelo/admin/rol';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {RolService} from 'src/app/servicios/rol.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Notificacion} from 'src/app/util/notificacion';
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {ComponenteBase} from 'src/app/util/componente-base';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss'],
})
export class RolComponent extends ComponenteBase implements OnInit {
  roles: Rol[];
  rol: Rol;
  rolEditForm: Rol;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;
  @ViewChild('table') table!: MdbTableDirective<Rol>;
  addRow = false;
  headers = ['Nombre', 'Descripcion'];
  estaEditando = false;
  codigoRolEditando = 0;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private rolService: RolService
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.roles = [];
    this.subscriptions = [];
    this.rol = new Rol();
    this.rolEditForm = new Rol();
  }

  ngOnInit(): void {
    this.rolService.getRol().subscribe((data) => {
      this.roles = data;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  crear(rol: Rol): void {
    //rol={...rol, estado:'ACTIVO'};
    if (rol.nombre === '' || rol.descripcion === '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    console.log(rol);

    if (rol.nombre === undefined || rol.descripcion === undefined) {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    this.showLoading = true;
    this.subscriptions.push(
      this.rolService.registroRol(rol).subscribe({
        next: (response: HttpResponse<Rol>) => {
          let nuevaRol: Rol = response.body;
          this.roles.push(nuevaRol);
          this.roles = [...this.roles];
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Rol creado con éxito'
          );
          this.rol = {
            codRol: 0,
            nombre: '',
            descripcion: '',
          };
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

  editRow(rol: Rol) {
    this.rolEditForm = {...rol};
    this.codigoRolEditando = rol.codRol;
  }

  undoRow() {
    this.codigoRolEditando = 0;
    this.rolEditForm = {
      codRol: 0,
      nombre: '',
      descripcion: '',
    };
  }

  actualizar(rol: Rol, formValue): void {
    console.log(formValue);

    if (formValue.nombre === '' || formValue.descripcion === '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    rol = {
      ...rol,
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
    };

    this.showLoading = true;
    this.subscriptions.push(
      this.rolService.actualizarRol(rol).subscribe({
        next: () => {
          let index = this.roles.findIndex(value => value.codRol === rol.codRol);
          this.roles[index] = rol;
          this.roles = [...this.roles];
          this.codigoRolEditando = 0;
          this.estaEditando = false;
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Rol actualizado con éxito');
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
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
      this.rolService.eliminarRol(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Rol eliminado con éxito'
          );
          this.showLoading = false;
          const index = this.roles.findIndex((rol) => rol.codRol === this.codigo);
          this.roles.splice(index, 1);
          this.roles = [...this.roles];
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
}
