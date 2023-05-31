import { Injectable } from '@angular/core';


@Injectable()
export class InscripcionCompletaDto {


public codigo: number;
public cedula: number;
public apellido: string;
public nombre: string;
public correoPersonal: string;
public sexo: string;
public fecha_nacimiento: string;
public num_telef_celular: string;
public num_telef_convencional: string;
public tipo_nacionalidad: string;
public cod_provincia_nacimiento: string;
public cod_canton_nacimiento: string;
public cod_provincia_residencia: string;
public cod_canton_residencia: string;
//public direccionActual: string;
public calle_principal_residencia: string;
public calle_secundaria_residencia: string;
public numero_casa: string;
public pais_titulo_segundonivel: string;
public ciudad_titulo_segundonivel: string;
public colegio: string;
public nombre_titulo_segundonivel: string;
public merito_academico_descripcion: string;
public merito_deportivo_descripcion: string;

public estado: string;
public fechaInscripcion: string;
}