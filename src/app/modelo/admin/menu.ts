export class Menu {
  public codMenu?: number;
  public etiqueta?: string;
  public ruta?: string;
  public menuPadre?: number;
  public orden?: number;
  public icono?:string;
  public descripcion?:string;

  constructor() {
    this.codMenu = null;
    this.etiqueta = '';
    this.ruta = '';
    this.menuPadre = null;
    this.orden = null;
  }

}
