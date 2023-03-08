import { Injectable } from '@angular/core';
import { SemestreTbl } from './util/semestre-tbl';

@Injectable()
export class Semestre {
  public codSemestre: number;
  public semestre: string;
  public estado: string;

  constructor($codSemestre: number,  $semestre: string, $estado: string) {
		this.codSemestre = $codSemestre;
		this.semestre = $semestre;
		this.estado = $estado;
	}

    /**
     * Getter $codSemestre
     * @return {number}
     */
	public get $codSemestre(): number {
		return this.codSemestre;
	}

    /**
     * Getter $semestre
     * @return {string}
     */
	public get $semestre(): string {
		return this.semestre;
	}

    /**
     * Getter $estado
     * @return {string}
     */
	public get $estado(): string {
		return this.estado;
	}


  /**
     * Setter $codSemestre
     * @param {number} value
     */
	public set $codSemestre(value: number) {
		this.codSemestre = value;
	}

    /**
     * Setter $semestre
     * @param {string} value
     */
	public set $semestre(value: string) {
		this.semestre = value;
	}

    /**
     * Setter $estado
     * @param {string} value
     */
	public set $estado(value: string) {
		this.estado = value;
	}




}
