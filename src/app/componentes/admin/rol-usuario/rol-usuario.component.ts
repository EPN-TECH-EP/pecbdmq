import { Component, OnInit } from '@angular/core';
import { MdbCheckboxChange } from 'mdb-angular-ui-kit/checkbox';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { Rol } from 'src/app/modelo/admin/rol';
import { RolAsignado } from 'src/app/modelo/admin/rol-asignado';
import { RolUsuario } from 'src/app/modelo/admin/rol-usuario';
import { Usuario } from 'src/app/modelo/usuario';
import { RolUsuarioService } from 'src/app/servicios/rol-usuario.service';
import { RolService } from 'src/app/servicios/rol.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ComponenteBase } from 'src/app/util/componente-base';
import { BuscarUsuarioFrm } from '../../../modelo/util/buscar-usuario-frm';

@Component({
  selector: 'app-rol-usuario',
  templateUrl: './rol-usuario.component.html',
  styleUrls: ['./rol-usuario.component.scss'],
})
export class RolUsuarioComponent extends ComponenteBase implements OnInit {
  roles: Rol[] = [];
  usuarios: Usuario[] = [];
  rolUsuario: RolUsuario[] = [];
  rolesAsignados: RolAsignado[] = [];

  usuarioSeleccionado: Usuario = null;

  headersUsuarios = ['Nombres', 'Apellidos', 'Nombre de usuario'];
  headersRoles = ['Nombre'];

  cambiosPendientes: boolean = false;
  usuarioFrm: BuscarUsuarioFrm = new BuscarUsuarioFrm();

  constructor(
    private rolUsuarioService: RolUsuarioService,
    private rolService: RolService,
    private usuarioService: UsuarioService,
    notificationService: MdbNotificationService
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    this.rolService.getRol().subscribe((data: Rol[]) => {
      this.roles = data;
    });
  }

  public buscarUsuarioPorNombreUsuario(nombreUsuario: string) {    
    this.usuarioService
      .buscarPorNombreUsuario(nombreUsuario)
      .subscribe((data: Usuario) => {
        if (data != null) {
          this.usuarioSeleccionado = data;
          this.showLoading = false;
          this.buscarRolesUsuario();
        }
      });
  }

  public buscarUsuarioPorNombreApellido(nombre: string, apellido: string) {
    this.usuarioService
      .buscarPorNombreApellido({ nombre, apellido })
      .subscribe((data: Usuario[]) => {
        if (data != null) {
          this.usuarios = data;
          this.showLoading = false;
        }
      });
  }

  public buscarRolesUsuario() {
    this.rolUsuarioService
      .getRolUsuarioPorUsuario(this.usuarioSeleccionado.codUsuario)
      .subscribe((data: RolUsuario[]) => {
        this.rolUsuario = data;
      });
      this.construirListaRolesAsignados();
  }

  public construirListaRolesAsignados() {
    this.rolesAsignados = [];
    this.roles.forEach((rol) => {
      // inicializa lista temporal de roles asignados
      let rolAsignado = new RolAsignado();
      rolAsignado.codRol = rol.codRol;
      rolAsignado.nombre = rol.nombre;
      rolAsignado.descripcion = rol.descripcion;
      rolAsignado.asignado = false;
      this.rolesAsignados.push(rolAsignado);
    });

    this.rolUsuario.forEach((rolUsuario) => {
      let rolAsignado = this.rolesAsignados.find(
        (rolAsignado) => rolAsignado.codRol == rolUsuario.rolUsuarioId.codRol
      );
      if (rolAsignado !== undefined) {
        rolAsignado.asignado = true;
      }
    });

    console.log(this.rolUsuario);
    console.log(this.rolesAsignados);
  }

  public guardarCambios(): void {}

  public hayUsuarioSeleccionado(): boolean {
    return (
      this.usuarioSeleccionado !== null &&
      this.usuarioSeleccionado !== undefined
    );
  }

  public buscarUsuarios(form: BuscarUsuarioFrm) {

    this.usuarioSeleccionado = null;
    this.usuarios = [];
    this.rolUsuario = [];

    if ((form.nombre !== null || form.apellido !== null)
      && (form?.nombre?.length > 0 || form?.apellido?.length > 0) )  {
      this.showLoading = true;
      this.buscarUsuarioPorNombreApellido(form.nombre, form.apellido);
      //console.log('buscarUsuarioPorNombreApellido')
    } else if (form.nombreUsuario !== null) {
      this.showLoading = true;
      this.buscarUsuarioPorNombreUsuario(form.nombreUsuario);
      //console.log('buscarUsuarioPorNombreUsuario')
    }

    /* console.log(this.usuarioFrm);
    console.log(form);
    console.log(this.usuarios); */
  }

  // tabla de resultados de busqueda de usuarios
  onRowClick(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    this.buscarRolesUsuario();
  }



  // mdb
  allRowsSelected(): boolean {
    /* const selectionsLength = this.selections.size;
    const dataLength = this.dataSource.length;
    return selectionsLength === dataLength; */
    return true;
  }

  toggleSelection(event: MdbCheckboxChange, rolAsignado: RolAsignado): void {
    this.cambiosPendientes = true;

    rolAsignado.asignado = event.checked;
  }

  toggleAll(event: MdbCheckboxChange): void {
    /* if (event.checked) {
      this.dataSource.forEach((row: Person) => {
        this.select(row);
      });
    } else {
      this.dataSource.forEach((row: Person) => {
        this.deselect(row);
      });
    } */
  }

  select(value: RolAsignado): void {
    /* if (!this.selections.has(value)) {
      this.selections.add(value);
    } */
  }

  deselect(value: RolAsignado): void {
    /* if (this.selections.has(value)) {
      this.selections.delete(value);
    } */
  }
}
