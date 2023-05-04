export class Menu {
  public codMenu?: number;
  public etiqueta?: string;
  public ruta?: string;
  public menu_padre?: number;
  public orden?: number;
  public icono?:string;
  public descripcion?:string;

  constructor() {
    this.codMenu = null;
    this.etiqueta = '';
    this.ruta = '';
    this.menu_padre = null;
    this.orden = null;
  }

}
