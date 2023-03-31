import { Injectable } from "@angular/core";


@Injectable()
export class DatoPersonal {
  private cod_datos_personales: number;
  //private cod_periodo_evaluacion: number;
  //private cod_periodo_academico: number;
  private cedula: string;
  private nombre: string;
  private apellido: string;
  private fecha_nacimiento: Date;
  private correo_personal: string;
  private validacion_correo: string;
  private num_telef: string;
  private ciudad: string;
  private tipo_sangre: string;
  private unidad: string;
  private estado: string;
  private provincia: string;



	constructor($cod_datos_personales: number, /*$cod_periodo_evaluacion: number, $cod_periodo_academico: number,*/ $cedula: string, $nombre: string, $apellido: string, $fecha_nacimiento: Date, $correo_personal: string, $validacion_correo: string, $num_telef: string, $ciudad: string, $tipo_sangre: string, $unidad: string, $estado: string, $provincia: string) {
		this.cod_datos_personales = $cod_datos_personales;
		//this.cod_periodo_evaluacion = $cod_periodo_evaluacion;
		//this.cod_periodo_academico = $cod_periodo_academico;
		this.cedula = $cedula;
		this.nombre = $nombre;
		this.apellido = $apellido;
		this.fecha_nacimiento = $fecha_nacimiento;
		this.correo_personal = $correo_personal;
		this.validacion_correo = $validacion_correo;
		this.num_telef = $num_telef;
		this.ciudad = $ciudad;
		this.tipo_sangre = $tipo_sangre;
		this.unidad = $unidad;
		this.estado = $estado;
		this.provincia = $provincia;
	}


    /**
     * Getter $cod_datos_personales
     * @return {number}
     */
	public get $cod_datos_personales(): number {
		return this.cod_datos_personales;
	}

    /**
     * Getter $cod_periodo_evaluacion
     * @return {number}
     */
	/*public get $cod_periodo_evaluacion(): number {
		return this.cod_periodo_evaluacion;
	}*/

    /**
     * Getter $cod_periodo_academico
     * @return {number}
     */
	/*public get $cod_periodo_academico(): number {
		return this.cod_periodo_academico;
	}*/

    /**
     * Getter $cedula
     * @return {string}
     */
	public get $cedula(): string {
		return this.cedula;
	}

    /**
     * Getter $nombre
     * @return {string}
     */
	public get $nombre(): string {
		return this.nombre;
	}

    /**
     * Getter $apellido
     * @return {string}
     */
	public get $apellido(): string {
		return this.apellido;
	}

    /**
     * Getter $fecha_nacimiento
     * @return {Date}
     */
	public get $fecha_nacimiento(): Date {
		return this.fecha_nacimiento;
	}

    /**
     * Getter $correo_personal
     * @return {string}
     */
	public get $correo_personal(): string {
		return this.correo_personal;
	}

    /**
     * Getter $validacion_correo
     * @return {string}
     */
	public get $validacion_correo(): string {
		return this.validacion_correo;
	}

    /**
     * Getter $num_telef
     * @return {string}
     */
	public get $num_telef(): string {
		return this.num_telef;
	}

    /**
     * Getter $ciudad
     * @return {string}
     */
	public get $ciudad(): string {
		return this.ciudad;
	}

    /**
     * Getter $tipo_sangre
     * @return {string}
     */
	public get $tipo_sangre(): string {
		return this.tipo_sangre;
	}

    /**
     * Getter $unidad
     * @return {string}
     */
	public get $unidad(): string {
		return this.unidad;
	}

    /**
     * Getter $estado
     * @return {string}
     */
	public get $estado(): string {
		return this.estado;
	}

    /**
     * Getter $provincia
     * @return {string}
     */
	public get $provincia(): string {
		return this.provincia;
	}

    /**
     * Setter $cod_datos_personales
     * @param {number} value
     */
	public set $cod_datos_personales(value: number) {
		this.cod_datos_personales = value;
	}

    /**
     * Setter $cod_periodo_evaluacion
     * @param {number} value
     */
	/*public set $cod_periodo_evaluacion(value: number) {
		this.cod_periodo_evaluacion = value;
	}*/

    /**
     * Setter $cod_periodo_academico
     * @param {number} value
     */
	/*public set $cod_periodo_academico(value: number) {
		this.cod_periodo_academico = value;
	}*/

    /**
     * Setter $cedula
     * @param {string} value
     */
	public set $cedula(value: string) {
		this.cedula = value;
	}

    /**
     * Setter $nombre
     * @param {string} value
     */
	public set $nombre(value: string) {
		this.nombre = value;
	}

    /**
     * Setter $apellido
     * @param {string} value
     */
	public set $apellido(value: string) {
		this.apellido = value;
	}

    /**
     * Setter $fecha_nacimiento
     * @param {Date} value
     */
	public set $fecha_nacimiento(value: Date) {
		this.fecha_nacimiento = value;
	}

    /**
     * Setter $correo_personal
     * @param {string} value
     */
	public set $correo_personal(value: string) {
		this.correo_personal = value;
	}

    /**
     * Setter $validacion_correo
     * @param {string} value
     */
	public set $validacion_correo(value: string) {
		this.validacion_correo = value;
	}

    /**
     * Setter $num_telef
     * @param {string} value
     */
	public set $num_telef(value: string) {
		this.num_telef = value;
	}

    /**
     * Setter $ciudad
     * @param {string} value
     */
	public set $ciudad(value: string) {
		this.ciudad = value;
	}

    /**
     * Setter $tipo_sangre
     * @param {string} value
     */
	public set $tipo_sangre(value: string) {
		this.tipo_sangre = value;
	}

    /**
     * Setter $unidad
     * @param {string} value
     */
	public set $unidad(value: string) {
		this.unidad = value;
	}

    /**
     * Setter $estado
     * @param {string} value
     */
	public set $estado(value: string) {
		this.estado = value;
	}

    /**
     * Setter $provincia
     * @param {string} value
     */
	public set $provincia(value: string) {
		this.provincia = value;
	}



}
