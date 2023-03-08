import { Semestre } from 'src/app/modelo//semestre';
import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse, HttpErrorResponse,HttpEvent,} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../modelo/custom-http-response';
import { Periodo } from '../modelo/periodo_academico';


@Injectable({providedIn: 'root',})

export class periodoAcademico {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getPeriodo(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(`${this.host}/periodoacademico/listartodo`);
  }

  public registroPeriodo(periodo: Periodo): Observable<HttpResponse<Periodo>> {
    return this.http.post<Periodo>(`${this.host}/periodoacademico/crear`, periodo, { observe: 'response' });
  }

    public eliminarPeriodo(codigo: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/periodoacademico/${codigo}`);
    }
   public actualizarPeriodo(periodo: Periodo, codigo:any): Observable<HttpResponse<Periodo>> {
    return this.http.put<Periodo>(`${this.host}/periodoacademico/${codigo}`, periodo, { observe: 'response' });
  }
  // public agregarSemestresACacheLocal(Semestres: Semestre[]): void {
  //   localStorage.setItem('semestres', JSON.stringify(Semestres));
  // }

  public obtenerSemestrePorPeriodoAcademico(semestre: Semestre) : Observable<Semestre[]>{
    return this.http.get<Semestre[]>(`${this.host}/semestre/lista/${semestre.semestre}`)
  }


}
