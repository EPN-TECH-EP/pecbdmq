import { Injectable } from '@angular/core';

@Injectable()
export class Requisito {
  public codigoRequisito: number;
  public codFuncionario: number;
  public nombre: string;
  public descripcion: string;
  public esDocumento: boolean;
  public estado: string;
}
