import { Injectable } from '@angular/core';

@Injectable()
export class Parametro {
  public codParametro?: number;
  public nombreParametro: string;
  public valor: string;
  public estado: string;
}
