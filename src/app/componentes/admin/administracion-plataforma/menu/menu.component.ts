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
  addRow = false;

  headersMenuN1 = ['Etiqueta', 'Orden', 'Descripción'];

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
  public registro(menu: Menu): void {
    menu = { ...menu };
    this.showLoading = true;

    // validación vacíos
    const vacios = ValidacionUtil.tienePropiedadesVacías(menu);
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

    this.subscriptions.push(
      this.menuService.crear(menu).subscribe({
        next: (response: HttpResponse<Menu>) => {
          // guardar en array el nuevo objeto
          let nuevoMenu: Menu = response.body;
          this.menusPrimerNivel.push(nuevoMenu);
          this.menusPrimerNivel = [...this.menusPrimerNivel];

          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Menú creado con éxito'
          );

          this.addRow = false;
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
  public editar(index: number) {
    this.editElementIndexN1 = index;
    this.menuEditForm = { ...this.menusPrimerNivel[index] };
  }

  public actualizar(menu: Menu, formValue): void {
    this.showLoading = true;

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

    menu = {
      ...menu,
      etiqueta: formValue.etiqueta,
      orden: formValue.orden,
      descripcion: formValue.descripcion,
    };

    this.subscriptions.push(
      this.menuService.actualizar(menu).subscribe({
        next: (response: HttpResponse<Menu>) => {
          this.menusPrimerNivel[this.editElementIndexN1] = response.body;
          this.menusPrimerNivel = [...this.menusPrimerNivel];
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            'Menú actualizado con éxito'
          );
          this.editElementIndexN1 = -1;
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
  public confirmaEliminar(event: Event, codigo: number): void {
    // verifica si tiene hijos

    this.subscriptions.push(
      this.menuService.listarHijos(codigo).subscribe((data: Menu[]) => {
        if (data.length > 0) {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            null,
            'No se puede eliminar un menú de primer nivel que tiene menús relacionados'
          );
          return;
        } else {
          super.confirmaEliminarMensaje();
          this.codigo = codigo;
          super.openPopconfirm(event, this.eliminar.bind(this));
        }
      })
    );
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
          const index = this.menusPrimerNivel.findIndex(
            (menu) => menu.codMenu === this.codigo
          );
          this.menusPrimerNivel.splice(index, 1);
          this.menusPrimerNivel = [...this.menusPrimerNivel];
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
  public onSelectRow(menu: Menu): void {

    this.menuN1Seleccionado = menu;
    this.menusSegundoNivel = [];
    this.menusTercerNivel = [];

    this.subscriptions.push(
      this.menuService.listarHijos(menu.codMenu).subscribe((data: Menu[]) => {
        if (data.length > 0) {
          this.menusSegundoNivel = data;
          console.log(this.menusSegundoNivel);
          return;
        }
      })
    );
  }
}
