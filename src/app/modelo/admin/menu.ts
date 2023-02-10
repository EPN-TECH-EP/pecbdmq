export class Menu {
  public id: number;
  public etiqueta: string;
  public ruta: string;
  public menu_padre: number;
  public orden: number;

  constructor() {
    this.id = null;
    this.etiqueta = '';
    this.ruta = '';
    this.menu_padre = null;
    this.orden = null;
  }

}
