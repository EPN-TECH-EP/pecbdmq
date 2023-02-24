import { Injectable } from "@angular/core";


@Injectable()
export class Paralelo {
  private cod_paralelo: string;
  private nombre_paralelo: string;


	constructor($cod_paralelo: string, $nombre_paralelo: string) {
		this.cod_paralelo = $cod_paralelo;
		this.nombre_paralelo = $nombre_paralelo;
	}


    /**
     * Getter $cod_paralelos
     * @return {string}
     */
	public get $cod_paralelo(): string {
		return this.cod_paralelo;
	}

    /**
     * Getter $nombre_paralelo
     * @return {string}
     */
	public get $nombre_paralelo(): string {
		return this.nombre_paralelo;
	}


}
