import { Injectable } from '@angular/core';

@Injectable()
export class TipoPrueba {
  public codTipoPrueba?: number;
  public tipoPrueba?: string;
  public estado?: string;
  public esFisica?: boolean;
}
