import { Injectable } from '@angular/core';

@Injectable()
export class RequisitoVal{
  public codigo: number;
  public nombre: string;
  public documento: boolean;
  public aprobado: boolean;
  public reprobado: boolean;
  public observacion: string;
}
