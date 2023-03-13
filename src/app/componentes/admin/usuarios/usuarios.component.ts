import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/modelo/usuario';
import { AlertaComponent } from '../../util/alerta/alerta.component';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { UsuarioService } from '../../../servicios/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { Notificacion } from 'src/app/util/notificacion';
import { PopconfirmComponent } from '../../util/popconfirm/popconfirm.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  popconfirmRef: MdbPopconfirmRef<PopconfirmComponent> | null = null;

  public showLoading: boolean = true;

  // variables de tabla
  usuarios: Usuario[];
  usuarioFrm: Usuario = new Usuario();
  @ViewChild('table') table!: MdbTableDirective<Usuario>;

  editElementIndex = -1;
  addRow = false;

  headers = [
    'Identificación',
    'Fecha de registro',
    'Fecha último ingreso',
    'Activo?',
    'Habilitado?'
  ]
  mensajeConfirmacion: string;
  mostrarConfirmacion:boolean = false;
  indexEliminar: number;
  currentRoute: string;

  constructor(
    public usuarioTemp: Usuario,
    private notificationService: MdbNotificationService,
    private usuarioService: UsuarioService,
    private popconfirmService: MdbPopconfirmService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.currentRoute = this.router.url;

    console.log(this.currentRoute);

    this.subscriptions.push(
      this.usuarioService.getUsuarios().subscribe(
        {
          next: (response) => {
            this.usuarios = response;
            this.showLoading = false;
          },
          error: (errorResponse: HttpErrorResponse) => {          
            this.notificacion(errorResponse);
            this.showLoading = false;
          },
        }
      )
    )
  }

  private notificacion(errorResponse: HttpErrorResponse) {

    let customError: CustomHttpResponse = errorResponse.error;
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;

    let mensajeError = customError.mensaje;
    let codigoError = errorResponse.status;

    if (!mensajeError) {
      mensajeError = 'Error inesperado';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    if (codigoError === 0) {
      mensajeError = 'Error de conexión al servidor';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }

  public notificacionOK(mensaje:string){
    this.notificationRef = Notificacion.notificar(
    this.notificationService,
    mensaje,
    TipoAlerta.ALERTA_OK
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // funcionalidad 

  confirmaActualizar(usuario: Usuario){
    this.mensajeConfirmacion = '¿Actualizar los datos del usuario?';
  }

  confirmaEliminar(usuario: Usuario){
    this.mensajeConfirmacion = '¿Eliminar el usuario? Esta acción es irreversible';
  }


  eliminar(usuario: Usuario){
    this.subscriptions.push(
      this.usuarioService.eliminarUsuario(usuario.nombreUsuario).subscribe(
        {
          next: (response) => {            
            this.showLoading = false;
            this.editElementIndex=-1;
            this.usuarios.splice(this.indexEliminar, 1);
            this.usuarios = [...this.usuarios];
            this.notificacionOK('Usuario eliminado con éxito');
          },
          error: (errorResponse: HttpErrorResponse) => {          
            this.notificacion(errorResponse);
            this.showLoading = false;
          },
        }
      )
    )
  }

  actualizar(usuario: Usuario, formValue){

    if (formValue.active === undefined) {
      usuario.active= false;
    } else {
      usuario.active = formValue.active;
    }

    if (formValue.notLocked === undefined) {
      usuario.notLocked= false;
    } else {
      usuario.notLocked = formValue.notLocked;
    }

    this.subscriptions.push(
      this.usuarioService.actualizarUsuario(usuario).subscribe(
        {
          next: (response) => {
            this.usuarios[this.editElementIndex] = response;
            this.showLoading = false;
            this.editElementIndex=-1;
            this.notificacionOK('Usuario actualizado con éxito');
          },
          error: (errorResponse: HttpErrorResponse) => {          
            this.notificacion(errorResponse);
            this.showLoading = false;
          },
        }
      )
    )
  }

  editar(index: number){
    this.editElementIndex = index; 
    this.usuarioFrm={...this.usuarios[index]};
  }

  deshacer(index: number){


    this.editElementIndex = -1;
  }

  // Funcionalidad de confirmación

  openPopconfirm(event: Event, index: number) {
    this.indexEliminar = index;
    const target = event.target as HTMLElement;

    console.log("mensaje de confirmacion: " + this.mensajeConfirmacion);

    this.popconfirmRef = this.popconfirmService.open(
      PopconfirmComponent,
      target,
      { popconfirmMode: 'modal', data: { mensaje: this.mensajeConfirmacion } }
    );

    this.popconfirmRef.onClose.subscribe((message: any) => {
      // cancela acción
      console.log("onClose() - " + message);
    });

    this.popconfirmRef.onConfirm.subscribe((message: any) => {
      //confirma acción
      console.log("onConfirm() - " + message);
      this.eliminar(this.usuarios[this.indexEliminar]);
    });

  }

  /*onCancel(){
    console.log('User cancelled action');
    // Handle the case where the user cancelled the action
    this.mostrarConfirmacion = false;
  }

  onConfirm(){
    console.log('User confirmed action');
    // Perform the action that the user confirmed
    this.mostrarConfirmacion = false;
  }*/

  buscar(event: Event): void {
    //console.log((event.target as HTMLInputElement).value);
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }
   
}
