import {Component, OnInit, ViewChild} from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {Rol} from 'src/app/modelo/admin/rol';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {Subscription} from 'rxjs';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {RolService} from 'src/app/servicios/rol.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Notificacion} from 'src/app/util/notificacion';
import {TipoAlerta} from "../../../../enum/tipo-alerta";

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss'],
})
export class RolComponent implements OnInit {
  //modelo
  roles: Rol[];
  rol: Rol;
  rolEditForm: Rol;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[] = [];
  public showLoading: boolean;

  //table
  @ViewChild('table') table!: MdbTableDirective<Rol>;
  editElementIndex = -1;
  addRow = false;

  headers = ['Nombre', 'Descripcion'];

  constructor(
    private notificationService: MdbNotificationService,
    private api: RolService
  ) {
    this.roles = [];
    this.subscriptions = [];
    this.rol = new Rol();
    this.rolEditForm = new Rol();
  }

  ngOnInit(): void {
    this.api.getRol().subscribe((data) => {
      this.roles = data;
    });
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  public registro(rol: Rol): void {
    //rol={...rol, estado:'ACTIVO'};
    console.log(rol);

    if (rol.nombre === undefined || rol.descripcion === undefined) {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    this.showLoading = true;
    this.subscriptions.push(
      this.api.registroRol(rol).subscribe({
        next: (response: HttpResponse<Rol>) => {
          let nuevaRol: Rol = response.body;
          this.roles.push(nuevaRol);
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationService,
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
            this.notificationService,
            errorResponse
          );
        },
      })
    );
  }

  editar(index: number) {
    this.editElementIndex = index;
    this.rolEditForm = {...this.roles[index]};
  }

  undoRow() {
    this.rolEditForm = {
      codRol: 0,
      nombre: '',
      descripcion: '',
    };
    this.editElementIndex = -1;
  }

  public actualizar(rol: Rol, formValue): void {
    console.log(formValue);

    if (formValue.nombre === '' || formValue.descripcion === ''){
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
      this.api.actualizarRol(rol).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationService,
            'Rol actualizado con éxito'
          );
          this.roles[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.rol = {
            codRol: 0,
            nombre: '',
            descripcion: '',
          };
          this.editElementIndex = -1;

          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificacion(
              this.notificationRef,
              this.notificationService,
              errorResponse
            );
          };
        },
      })
    );
  }

  public eliminar(codigo: number): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.api.eliminarRol(codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationService,
            'Rol eliminado con éxito'
          );
          this.showLoading = false;
          const index = this.roles.findIndex((rol) => rol.codRol === codigo);
          this.roles.splice(index, 1);
          this.roles = [...this.roles];
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationService,
            errorResponse
          );
        },
      })
    );
  }
}
