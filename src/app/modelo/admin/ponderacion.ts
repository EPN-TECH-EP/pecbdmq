import { Injectable } from '@angular/core';

@Injectable()
export class Ponderacion {
  public cod_ponderacion: number;
  public cod_modulo: string;
  public cod_periodo_academico: string;
  public cod_componente_nota: string;
  public cod_tipo_nota: string;
  public porcentajefinalponderacion: number;
  public porcentajenotamateria: number;
  public fechainiciovigencia: Date;
  public fechafinvigencia: Date;
  public estado: string;
}

