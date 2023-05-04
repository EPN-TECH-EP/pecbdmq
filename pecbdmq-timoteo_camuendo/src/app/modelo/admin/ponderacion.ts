import { Injectable } from '@angular/core';

@Injectable()
export class Ponderacion {
  public cod_ponderacion: number;
  public cod_modulo: number;
  public cod_periodo_academico: number;
  public cod_componente_nota: number;
  public cod_tipo_nota: number;
  public porcentajefinalponderacion: number;
  public porcentajenotamateria: number;
  public fechainiciovigencia: Date;
  public fechafinvigencia: Date;
  public estado: string;
}

