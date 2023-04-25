import { Component, OnInit } from '@angular/core';
import { MdbCheckboxChange } from 'mdb-angular-ui-kit/checkbox';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { MdbStepChangeEvent } from 'mdb-angular-ui-kit/stepper';
import { Menu } from 'src/app/modelo/admin/menu';
import { MenuAsignado } from 'src/app/modelo/admin/menu-asignado';
import { MenuRol } from 'src/app/modelo/admin/menu-rol';
import { MenuRolId } from 'src/app/modelo/admin/menu-rol-id';
import { Rol } from 'src/app/modelo/admin/rol';
import { MenuRolService } from 'src/app/servicios/menu-rol.service';
import { MenuService } from 'src/app/servicios/menu.service';
import { RolService } from 'src/app/servicios/rol.service';
import { ComponenteBase } from 'src/app/util/componente-base';
import { Notificacion } from 'src/app/util/notificacion';

@Component({
  selector: 'app-menu-rol',
  templateUrl: './menu-rol.component.html',
  styleUrls: ['./menu-rol.component.scss'],
})
export class MenuRolComponent extends ComponenteBase implements OnInit {
  roles: Rol[] = [];
  menus: Menu[] = [];
  menusRol: MenuRol[] = [];
  menusAsignados: MenuAsignado[] = [];

  rolSeleccionado: Rol = new Rol();
  step: number = 0;

  headers = ['ID', 'Etiqueta', 'Descripción', 'ID Padre'];

  cambiosPendientes: boolean = false;

  constructor(
    private menuRolService: MenuRolService,
    private rolService: RolService,
    private menuService: MenuService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
  }

  ngOnInit(): void {
    this.rolService.getRol().subscribe((data: Rol[]) => {
      this.roles = data;

      if (this.roles.length > 0) {
        this.rolSeleccionado = this.roles[0];
      }
    });
    this.menuService.listarMenu().subscribe((data: Menu[]) => {
      this.menus = data;
    });
  }

  public stepChanged(event: any) {
    this.step = (event as MdbStepChangeEvent).activeStepIndex;
    if (this.step == 1) {
      this.menuRolService
        .getMenuRolPorRol(this.rolSeleccionado.codRol)
        .subscribe((data: MenuRol[]) => {
          this.menusRol = data;

          this.construirListaMenusAsignados();
          this.cambiosPendientes = false;
        });
    }
  }

  private construirListaMenusAsignados(): void {
    this.menusAsignados = [];

    //inicializa lista temporal de menus asignados
    this.menus.forEach((menu) => {
      let menuAsignado = new MenuAsignado();
      menuAsignado.codMenu = menu.codMenu;
      menuAsignado.etiqueta = menu.etiqueta;
      menuAsignado.ruta = menu.ruta;
      menuAsignado.menu_padre = menu.menu_padre;
      menuAsignado.orden = menu.orden;
      menuAsignado.icono = menu.icono;
      menuAsignado.descripcion = menu.descripcion;
      menuAsignado.asignado = false;
      this.menusAsignados.push(menuAsignado);
    });
    this.menusRol.forEach((menuRol) => {
      let menuAsignado = this.menusAsignados.find(
        (menuAsignado) => menuAsignado.codMenu == menuRol.menuRolId.codMenu
      );
      if (menuAsignado !== undefined) {
        menuAsignado.asignado = true;
      }
    });

    // console.log(this.menusAsignados);
  }

  public guardarCambios(): void {
    if (this.cambiosPendientes) {
      let nuevaAsignacion: MenuRol[] = [];

      this.menusAsignados.forEach((menuAsignado) => {
        if (menuAsignado.asignado) {
          let menuRol = new MenuRol();
          menuRol.menuRolId = new MenuRolId();
          menuRol.menuRolId.codMenu = menuAsignado.codMenu;
          menuRol.menuRolId.codRol = this.rolSeleccionado.codRol;
          nuevaAsignacion.push(menuRol);
        }
      });

      console.log(nuevaAsignacion);

      this.menuRolService.asignarMenuRol(nuevaAsignacion).subscribe((data) => {
        console.log(data);
        this.cambiosPendientes = false;

        Notificacion.notificacionOK(
          this.notificationRef,
          this.notificationServiceLocal,
          'Se guardaron los cambios'
        );
      });
    }
  }

  // mdb
  allRowsSelected(): boolean {
    /* const selectionsLength = this.selections.size;
    const dataLength = this.dataSource.length;
    return selectionsLength === dataLength; */
    return true;
  }

  toggleSelection(event: MdbCheckboxChange, asignado: MenuAsignado): void {
    this.cambiosPendientes = true;

    asignado.asignado = event.checked;
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

  select(value: MenuAsignado): void {
    /* if (!this.selections.has(value)) {
      this.selections.add(value);
    } */
  }

  deselect(value: MenuAsignado): void {
    /* if (this.selections.has(value)) {
      this.selections.delete(value);
    } */
  }
}
