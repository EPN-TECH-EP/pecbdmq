import {Injectable} from "@angular/core";


@Injectable()
export class Paralelo {
  public codParalelo: string;
  public nombreParalelo: string;
  public estado: string;


  constructor($cod_paralelo: string, $nombre_paralelo: string, $estado: string) {
    this.codParalelo = $cod_paralelo;
    this.nombreParalelo = $nombre_paralelo;
    this.estado = $estado;
  }
}
