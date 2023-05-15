import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { AlertaComponent } from 'src/app/componentes/util/alerta/alerta.component';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { Menu } from 'src/app/modelo/admin/menu';
import { MenuService } from 'src/app/servicios/menu.service';
import { ComponenteBase } from 'src/app/util/componente-base';
import { Notificacion } from 'src/app/util/notificacion';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent extends ComponenteBase implements OnInit {
  menusPrimerNivel: Menu[] = [];
  menusSegundoNivel: Menu[] = [];
  menusTercerNivel: Menu[] = [];

  menuN1Seleccionado: Menu = new Menu();
  menuN2Seleccionado: Menu = new Menu();
  menuN3Seleccionado: Menu = new Menu();

  menu: Menu = new Menu();
  menuEditForm: Menu = new Menu();

  selectedRow: any;

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  validacionUtil = ValidacionUtil;

  @ViewChild('table') table!: MdbTableDirective<Menu>;
  editElementIndexN1 = -1;
  editElementIndexN2 = -1;
  editElementIndexN3 = -1;

  // variables para agregar filas
  addRowN1 = false;
  addRowN2 = false;
  addRowN3 = false;

  headersMenuN1 = ['Etiqueta', 'Orden', 'Descripción'];
  headersMenuN2 = [...this.headersMenuN1, 'Ruta'];
  headersMenuN3 = [...this.headersMenuN2, 'Icono'];

  nivelEliminar: number;

  constructor(
    private menuService: MenuService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.menuService.listarMenuPrimerNivel().subscribe((data: Menu[]) => {
        this.menusPrimerNivel = data;
      })
    );
  }

  // nivel 2 para hijos de menú nivel 1
  // nivel 3 para hijos de menú nivel 2
  public listarHijosNivel(codMenuPadre: number, nivel: number): void {
    this.subscriptions.push(
      this.menuService.listarHijos(codMenuPadre).subscribe((data: Menu[]) => {
        if (nivel === 2) {
          this.menusSegundoNivel = data;
        } else if (nivel === 3) {
          this.menusTercerNivel = data;
        }
      })
    );
  }

  initMenuN1(): Menu {
    let menu = new Menu();
    menu.codMenu = null;
    menu.etiqueta = '';
    menu.ruta = '';
    menu.menuPadre = null;
    menu.orden = null;
    menu.icono = '';
    menu.descripcion = '';
    return menu;
  }

  //registro
  public registro(menu: Menu, nivel: number): void {
    this.showLoading = true;

    // asigna el menú padre
    if (nivel === 1) {
      menu = { ...menu };
    } else if (nivel === 2) {
      menu = { ...menu, menuPadre: this.menuN1Seleccionado.codMenu };
    } else if (nivel === 3) {
      menu = { ...menu, menuPadre: this.menuN2Seleccionado.codMenu };
    }

    // validación vacíos
    // se requiere validar por nivel de menú

    // primero validar campos obligatorios en todos los niveles
    if (ValidacionUtil.isNullOrEmpty(menu.etiqueta)) {
      this.showLoading = false;
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    // validar campos obligatorios segundo nivel
    if (nivel === 2) {
      if (ValidacionUtil.isNullOrEmpty(menu.ruta)) {
        this.showLoading = false;
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          null,
          'Todos los campos deben estar llenos'
        );
        return;
      }
    } else if (nivel === 3) {
      if (
        ValidacionUtil.isNullOrEmpty(menu.ruta) ||
        ValidacionUtil.isNullOrEmpty(menu.icono) ||
        ValidacionUtil.isNullOrEmpty(menu.descripcion)
      ) {
        this.showLoading = false;
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          null,
          'Todos los campos deben estar llenos'
        );
        return;
      }
    }

    /*const vacios = ValidacionUtil.tienePropiedadesVacías(menu);
    if (!ValidacionUtil.isNullOrEmptyArray(vacios)) {
      this.showLoading = false;
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }*/

    this.subscriptions.push(
      this.menuService.crear(menu).subscribe({
        next: (response: HttpResponse<Menu>) => {
          // guardar en array el nuevo objeto
          let nuevoMenu: Menu = response.body;

          // actualiza el array correspondiente
          if (nivel === 1) {
            this.menusPrimerNivel.push(nuevoMenu);
            this.menusPrimerNivel = [...this.menusPrimerNivel];
            this.addRowN1 = false;
          } else if (nivel === 2) {
            this.menusSegundoNivel.push(nuevoMenu);
            this.menusSegundoNivel = [...this.menusSegundoNivel];
            this.addRowN2 = false;
          } else if (nivel === 3) {
            this.menusTercerNivel.push(nuevoMenu);
            this.menusTercerNivel = [...this.menusTercerNivel];
            this.addRowN3 = false;
          }                    

          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Menú creado con éxito'
          );

          
          this.menu = this.initMenuN1();
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

  // editar
  public editar(index: number, nivel: number) {
    if (nivel === 1) {
      this.editElementIndexN1 = index;
      this.menuEditForm = { ...this.menusPrimerNivel[index] };
    } else if (nivel === 2) {
      this.editElementIndexN2 = index;
      this.menuEditForm = { ...this.menusSegundoNivel[index] };
    } else if (nivel === 3) {
      this.editElementIndexN3 = index;
      this.menuEditForm = { ...this.menusTercerNivel[index] };
    }
  }

  public actualizar(menu: Menu, formValue, nivel: number): void {
    this.showLoading = true;

    // validación vacíos
    // se requiere validar por nivel de menú

    // primero validar campos obligatorios en todos los niveles
    if (ValidacionUtil.isNullOrEmpty(menu.etiqueta)) {
      this.showLoading = false;
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    // validar campos obligatorios segundo nivel
    if (nivel === 2) {
      if (ValidacionUtil.isNullOrEmpty(menu.ruta)) {
        this.showLoading = false;
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          null,
          'Todos los campos deben estar llenos'
        );
        return;
      }
    } else if (nivel === 3) {
      if (
        ValidacionUtil.isNullOrEmpty(menu.ruta) ||
        ValidacionUtil.isNullOrEmpty(menu.icono) ||
        ValidacionUtil.isNullOrEmpty(menu.descripcion)
      ) {
        this.showLoading = false;
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          null,
          'Todos los campos deben estar llenos'
        );
        return;
      }
    }

    // validación vacíos
    const vacios = ValidacionUtil.tienePropiedadesVacías(formValue);
    if (!ValidacionUtil.isNullOrEmptyArray(vacios)) {
      this.showLoading = false;
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'Todos los campos deben estar llenos'
      );
      return;
    }

    // prepara el objeto a actualizar
    menu = {
      ...menu,
      etiqueta: formValue.etiqueta,
      orden: formValue.orden,
      descripcion: formValue.descripcion,
    };

    if (nivel === 2) menu = { ...menu, ruta: formValue.ruta };
    else if (nivel === 3)
      menu = { ...menu, icono: formValue.icono, ruta: formValue.ruta };

    this.subscriptions.push(
      this.menuService.actualizar(menu).subscribe({
        next: (response: HttpResponse<Menu>) => {
          // actualiza el objeto en el array correspondiente
          if (nivel === 1) {
            this.menusPrimerNivel[this.editElementIndexN1] = response.body;
            this.menusPrimerNivel = [...this.menusPrimerNivel];
          } else if (nivel === 2) {
            this.menusSegundoNivel[this.editElementIndexN2] = response.body;
            this.menusSegundoNivel = [...this.menusSegundoNivel];
          } else if (nivel === 3) {
            this.menusTercerNivel[this.editElementIndexN3] = response.body;
            this.menusTercerNivel = [...this.menusTercerNivel];
          }

          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Menú actualizado con éxito'
          );

          // reestablece índices
          this.editElementIndexN1 = -1;
          this.editElementIndexN2 = -1;
          this.editElementIndexN3 = -1;
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

  // eliminar
  public confirmaEliminar(event: Event, codigo: number, nivel: number): void {
    // verifica si tiene hijos solamente si es de nivel 1 o 2
    if (nivel === 1 || nivel === 2) {
      this.subscriptions.push(
        this.menuService.listarHijos(codigo).subscribe((data: Menu[]) => {
          if (data.length > 0) {
            Notificacion.notificacion(
              this.notificationRef,
              this.notificationServiceLocal,
              null,
              'No se puede eliminar un menú de primer o segundo nivel que tiene menús relacionados'
            );
            return;
          } else {
            super.confirmaEliminarMensaje();
            this.codigo = codigo;
            this.nivelEliminar = nivel;
            super.openPopconfirm(event, this.eliminar.bind(this));
          }
        })
      );
    } else {
      super.confirmaEliminarMensaje();
      this.codigo = codigo;
      this.nivelEliminar = nivel;
      super.openPopconfirm(event, this.eliminar.bind(this));
    }
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.menuService.eliminar(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Menú eliminado con éxito'
          );
          this.showLoading = false;

          if (this.nivelEliminar == 1) {
            const index = this.menusPrimerNivel.findIndex(
              (menu) => menu.codMenu === this.codigo
            );
            this.menusPrimerNivel.splice(index, 1);
            this.menusPrimerNivel = [...this.menusPrimerNivel];
          } else if (this.nivelEliminar == 2) {
            const index = this.menusSegundoNivel.findIndex(
              (menu) => menu.codMenu === this.codigo
            );
            this.menusSegundoNivel.splice(index, 1);
            this.menusSegundoNivel = [...this.menusSegundoNivel];
          } else if (this.nivelEliminar == 3) {
            const index = this.menusTercerNivel.findIndex(
              (menu) => menu.codMenu === this.codigo
            );
            this.menusTercerNivel.splice(index, 1);
            this.menusTercerNivel = [...this.menusTercerNivel];
          }
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

  // selección de menu de primer nivel
  public onSelectRow(menu: Menu, nivel: number): void {
    if (nivel === 1) {
      this.menuN1Seleccionado = menu;
      this.menuN2Seleccionado = null;
      this.menuN3Seleccionado = null;

      this.menusSegundoNivel = [];
      this.menusTercerNivel = []; 

      // obtiene los hijos del menú seleccionado
      this.obtenerMenusHijos(menu.codMenu, nivel);
    } else if (nivel === 2) {
      this.menuN2Seleccionado = menu;
      this.menuN3Seleccionado = null;
      this.menusTercerNivel = []; 

      // obtiene los hijos del menú seleccionado
      this.obtenerMenusHijos(menu.codMenu, nivel);
    } else if (nivel === 3) {
      this.menuN3Seleccionado = menu;
    }
  }

  obtenerMenusHijos(codMenuPadre: number, nivel: number): void {
    this.subscriptions.push(
      this.menuService.listarHijos(codMenuPadre).subscribe((data: Menu[]) => {
        if (nivel === 1) this.menusSegundoNivel = data;
        else if (nivel === 2) this.menusTercerNivel = data;
      })
    );
  }
}
