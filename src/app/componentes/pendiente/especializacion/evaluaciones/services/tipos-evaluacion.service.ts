import { Injectable } from '@angular/core';
import { environment } from "../../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";

export interface TipoEvaluacion {
  codTipoEvaluacion: number;
  nombre: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class TiposEvaluacionService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar() {
    return this.http.get<TipoEvaluacion[]>(`${ this.host }/tiposEvaluacion`);
  }



}
