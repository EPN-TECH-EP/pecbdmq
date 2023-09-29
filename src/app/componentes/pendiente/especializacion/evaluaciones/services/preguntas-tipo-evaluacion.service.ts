import { Injectable } from '@angular/core';
import { environment } from "../../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";

export interface PreguntaTipoEvaluacion {
  codPregunta: number;
  codTipoEvaluacion: number;
  pregunta: string;
  estado: string;
}


@Injectable({
  providedIn: 'root'
})
export class PreguntasTipoEvaluacionService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listarPorTipoEvaluacion(codTipoEvaluacion: number) {
    return this.http.get<PreguntaTipoEvaluacion[]>(`${ this.host }/preguntasEvaluaciones/${ codTipoEvaluacion }`);
  }
}
