import { Injectable } from '@angular/core';
import { environment } from "../../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";


export interface RespuestaEstudiante {
  codEstudiante?: number;
  codPreguntaTipoEvaluacion: number;
  codEvaluacion: number;
  respuesta: boolean;
  fechaRespuesta: Date;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class RespuestasEstudiantesService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  guardarRespuestas(respuestas: RespuestaEstudiante[]) {
    return this.http.post<RespuestaEstudiante[]>(`${ this.host }/respuestaEstudiante`, respuestas);
  }

  esEncuestaFinalizada(codEstudiante: number, codEvaluacion: number) {
    return this.http.get<boolean>(`${ this.host }/respuestaEstudiante/${ codEstudiante }/${ codEvaluacion }`);
  }
}
